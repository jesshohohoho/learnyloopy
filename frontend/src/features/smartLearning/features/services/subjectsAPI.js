import { authenticatedFetch } from '../../../../utils/auth';
import { API_ENDPOINTS } from "../../../../config/api";
const API_BASE = `${API_ENDPOINTS.smartLearning}`


export const subjectsAPI = {
  getUserSubjects: async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/subjects/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Return array of subject names
    } catch (error) {
      console.error('Error fetching user subjects:', error);
      throw error;
    }
  }
};