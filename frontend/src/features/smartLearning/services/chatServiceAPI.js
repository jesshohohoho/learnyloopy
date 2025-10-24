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
    
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please sign out and log in again.");
      } else if (response.status === 503) {
        throw new Error(data.detail || "Sorry! Our AI service is currently busy. Please try again in a few moments.");
      } else if (response.status === 400) {
        throw new Error(data.detail || "Your question is too long. Please try with a shorter question.");
      } else {
        throw new Error(data.detail || "Failed to get an answer. Please try again later.");
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in askQuestion service:", error);
    throw error;
  }
};