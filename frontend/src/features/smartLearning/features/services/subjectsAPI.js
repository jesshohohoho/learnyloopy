import { authenticatedFetch } from '../../../../utils/auth';

const API_BASE = "http://localhost:8000/smart-learning";

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