import { authenticatedFetch, authenticatedFetchFormData } from '../../../../utils/auth';
const API_BASE = "http://localhost:8000/smart-learning/flashcards";

export const flashcardsAPI = {
  // Get due flashcards for review
  getDueFlashcards: async (subject) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/review/${encodeURIComponent(subject)}`);
      
      if (response.status === 404) {
        // Check if any flashcards exist for this subject
        const hasFlashcards = await flashcardsAPI.checkFlashcardsExist(subject);
        
        if (hasFlashcards) {
          throw new Error('No due flashcards for this subject');
        } else {
          throw new Error('No flashcards found');
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to get flashcards');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Check if flashcards exist for a subject
  checkFlashcardsExist: async (subject) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/view/${encodeURIComponent(subject)}`);
      if (response.ok) {
        const flashcards = await response.json();
        return flashcards.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error checking flashcards:', error);
      return false;
    }
  },

  // Submit flashcard review rating
  reviewFlashcard: async (flashcardId, rating) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/review/${flashcardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error('Failed to review flashcard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
      throw error;
    }
  }
};