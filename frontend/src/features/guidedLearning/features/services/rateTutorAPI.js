import { authenticatedFetch } from "../../../../utils/auth";
import { API_ENDPOINTS } from "../../../../config/api";
const API_BASE = `${API_ENDPOINTS.guidedLearning}`

export const rateTutorAPI = {
  // get all tutors for dropdown selection
  getAllTutors: async () => {
    try {
      const response = await fetch(`${API_BASE}/tutors/`);
      if (!response.ok) {
        throw new Error('Failed to fetch tutors');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Fetch tutors failed: ${error.message}`);
    }
  },

  // Get subjects for selected tutor
  getTutorSubjects: (tutors, tutorName) => {
    const tutor = tutors.find(t => t.name === tutorName);
    return tutor?.subject || [];
  },

  // Find tutor by name to get their ID
  findTutorByName: async (tutorName) => {
    try {
      const response = await fetch(`${API_BASE}/tutors/`);
      if (!response.ok) {
        throw new Error('Failed to fetch tutors');
      }
      
      const tutors = await response.json();
      const tutor = tutors.find(t => t.name.toLowerCase() === tutorName.toLowerCase());
      
      if (!tutor) {
        throw new Error(`Tutor "${tutorName}" not found`);
      }
      
      return tutor;
    } catch (error) {
      throw new Error(`Find tutor failed: ${error.message}`);
    }
  },

  addReview: async (reviewData) => {
    try {

      const tutor = await rateTutorAPI.findTutorByName(reviewData.tutorName);
      
      const response = await authenticatedFetch(`${API_BASE}/add-review`, {
        method: 'POST',
        body: JSON.stringify({
          tutor_id: tutor.id, // Use the found tutor's ID
          course_name: reviewData.courseName,
          rating: reviewData.rating,
          comment: reviewData.comment || null,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // Get all reviews for a tutor
  getReviews: async (tutorId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/tutor/${tutorId}/reviews`);
      return await response.json();
    } catch (error) {
      throw new Error(`Fetch reviews failed: ${error.message}`);
    }
  },

  getReviewsByTutorName: async (tutorName) => {
    try {

      const tutor = await rateTutorAPI.findTutorByName(tutorName);
      return await rateTutorAPI.getReviews(tutor.id);
    } catch (error) {
      throw new Error(`Fetch reviews failed: ${error.message}`);
    }
  }
};