// src/features/revision/hooks/useFlashcards.js
import { useState, useEffect, useCallback } from 'react';
import { flashcardsAPI } from '../services/flashcardsAPI';

// Rating mappings
const RATING_MAP = {
  'again': 1,
  'hard': 2,
  'good': 3,
  'easy': 4
};

// Error message mappings
const ERROR_MESSAGES = {
  'No due flashcards for this subject': 'All flashcards are up to date! No due flashcards for review.',
  'No flashcards found': 'No flashcards found for this subject.',
  'Failed to get flashcards': 'Failed to load flashcards. Please try again.'
};

export const useFlashcards = (subject) => {
  // Flashcard data
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Progress tracking
  const [progress, setProgress] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });

  // Load flashcards when subject changes
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!subject) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const flashcardData = await flashcardsAPI.getDueFlashcards(subject);
        
        if (flashcardData.length === 0) {
          setError('No due flashcards for this subject');
        } else {
          setCards(flashcardData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading flashcards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [subject]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
    return currentIndex >= cards.length - 1; // Return true if this was the last card
  }, [currentIndex, cards.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Handle flashcard review
  const reviewFlashcard = useCallback(async (responseType) => {
    try {
      const currentCard = cards[currentIndex];
      const rating = RATING_MAP[responseType];

      console.log(`Request URL: http://localhost:8000/flashcards/review_flashcard/${currentCard.id}`);
      console.log(`Request Body:`, JSON.stringify({ rating }));
      
      // Submit review to backend
      await flashcardsAPI.reviewFlashcard(currentCard.id, rating);
      
      // Update local progress
      setProgress(prev => ({
        ...prev,
        [responseType]: prev[responseType] + 1
      }));
      
      // Move to next card
      const isLastCard = goToNext();
      return { success: true, isLastCard };
      
    } catch (err) {
      console.error('Error reviewing flashcard:', err);
      // Continue to next card even if API fails
      const isLastCard = goToNext();
      return { success: false, isLastCard, error: err.message };
    }
  }, [cards, currentIndex, goToNext]);

  // Keyboard navigation
  const handleKeyPress = useCallback((e) => {
    switch (e.key) {
      case 'ArrowRight':
        goToNext();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case ' ':
        e.preventDefault(); // Prevent page scroll
        flipCard();
        break;
      case '1':
        if (isFlipped) reviewFlashcard('again');
        break;
      case '2':
        if (isFlipped) reviewFlashcard('hard');
        break;
      case '3':
        if (isFlipped) reviewFlashcard('good');
        break;
      case '4':
        if (isFlipped) reviewFlashcard('easy');
        break;
      default:
        break;
    }
  }, [isFlipped, goToNext, goToPrevious, flipCard, reviewFlashcard]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Helper functions
  const getCurrentCard = () => cards[currentIndex] || null;

  const getProgress = () => {
    const completionPercentage = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
    return {
      current: currentIndex + 1,
      total: cards.length,
      percentage: Math.round(completionPercentage)
    };
  };

  const getFriendlyError = () => {
    return ERROR_MESSAGES[error] || error;
  };

  const canGoNext = currentIndex < cards.length - 1;
  const canGoPrevious = currentIndex > 0;
  const hasCards = cards.length > 0;

  return {
    // Flashcard data
    cards,
    currentCard: getCurrentCard(),
    currentIndex,
    isFlipped,
    
    // Navigation
    goToNext,
    goToPrevious,
    flipCard,
    canGoNext,
    canGoPrevious,
    
    // Review functionality
    reviewFlashcard,
    
    // Progress tracking
    progress,
    getProgress,
    
    // UI states
    loading,
    error,
    getFriendlyError,
    hasCards,
    
    // Keyboard handling is automatic via useEffect
  };
};