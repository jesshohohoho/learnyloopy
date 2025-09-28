import { authenticatedFetch } from '../../../../utils/auth';
import { API_ENDPOINTS } from "../../../../config/api";
const API_BASE= `${API_ENDPOINTS.guidedLearning}`

export const becomeTutorAPI = {
  submitTutorApplication: async (tutorData) => {
    try {
      const payload = {
        name: tutorData.name,
        teaching_mode: tutorData.teachingMode, // Array: ["Online", "Physical"] or ["Online"] or ["Physical"]
        subject: tutorData.subjects ? tutorData.subjects.split(',').map(s => s.trim()) : [], // Convert string to array
        experience: parseInt(tutorData.experience),
        credits: 0, // Default for new tutors
        hourly_rate: parseFloat(tutorData.hourlyRate),
      };

      const response = await authenticatedFetch(`${API_BASE}/add_tutor/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Become tutor API error:', error);
      throw error;
    }
  }
};