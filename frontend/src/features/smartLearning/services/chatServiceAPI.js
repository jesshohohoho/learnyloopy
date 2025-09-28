import { authenticatedFetch, authenticatedFetchFormData } from '../../../utils/auth';
import { API_ENDPOINTS } from "../../../config/api";
const API_BASE = `${API_ENDPOINTS.smartLearning}`

export const askQuestion = async (subject, text) => {
  try {
    const response = await authenticatedFetch(`${API_BASE}/ask_question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, text }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in askQuestion service:", error);
    throw error;
  }
};