import { authenticatedFetch } from "../../../utils/auth";

const API_BASE_URL = "http://localhost:8000/guided-learning";

export const listTutorAPI = {

  // Get top 10 tutors
  async getAllTutors(limit = null) {
    try {
      const url = limit 
        ? `${API_BASE_URL}/tutors/?limit=${limit}` 
        : `${API_BASE_URL}/tutors/`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch tutors');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  },

  // Get tutor details
  async getTutorDetails(tutorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}/details/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tutor details for ID ${tutorId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tutor details for ID ${tutorId}:`, error);
      throw error;
    }
  },

};