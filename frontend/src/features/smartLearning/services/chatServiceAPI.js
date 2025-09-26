import { authenticatedFetch, authenticatedFetchFormData } from '../../../utils/auth';

export const askQuestion = async (subject, text) => {
  try {
    const response = await authenticatedFetch("http://localhost:8000/smart-learning/ask_question", {
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