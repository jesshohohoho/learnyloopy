
import {authenticatedFetch} from '../../../../utils/auth'

const API_BASE = "http://localhost:8000/guided-learning";


export const findTutorAPI = {
  findTutor: async (criteria) => {
    try {
      const payload = {
        desired_teaching_style: criteria.teachingStyle ? [criteria.teachingStyle] : [],
        subject: criteria.subject ? [criteria.subject] : [],
        desired_teaching_mode: criteria.tutoringMode ? [criteria.tutoringMode] : [],
        max_hourly_rate: criteria.maxHourlyRate ? parseFloat(criteria.maxHourlyRate) : 0,
        min_experience: criteria.minExperience ? parseInt(criteria.minExperience) : 0,
      };

      // Choose different backend endpoint based on ranking option (overall or specific)
      const endpoint = criteria.rankingOption === "best_overall" 
        ? `${API_BASE}/find-tutor/` 
        : `${API_BASE}/find-tutor/ranked/`;

      const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (criteria.rankingOption === "best_overall") {
        return data; 
      } else {
        // Extract specific ranking
        const rankings = data;
        switch (criteria.rankingOption) {
          case "most_affordable":
            return rankings.best_price ? [rankings.best_price.tutor_data] : [];
          case "most_experienced":
            return rankings.best_experience ? [rankings.best_experience.tutor_data] : [];
          case "most_active":
            return rankings.best_credits ? [rankings.best_credits.tutor_data] : [];
          default:
            return rankings.best_similarity?.map(item => item.tutor_data) || [];
        }
      }

    } catch (error) {
      throw new Error(error.message || 'Failed to fetch tutors');
    }
  },

  getAvailableSubjects: async () => {
    try {
      const response = await fetch(`${API_BASE}/subjects/`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch subjects');
    }
  },

  getAvailableTeachingStyles: async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/teaching-styles/`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch teaching styles');
    }
  },

  getTutorDetails: async (tutorId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/tutors/${tutorId}/details/`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch tutor details');
    }
  }

};