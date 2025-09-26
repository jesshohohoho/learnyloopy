// forum/features/services/addQuestionAPI.js
const API_BASE_URL = "http://localhost:8000";


// Utility function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Utility function to create headers with auth
const createAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Enhanced fetch wrapper with error handling
const authenticatedFetch = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...createAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // Handle authentication errors
  if (response.status === 401) {
    // Token expired or invalid - you might want to redirect to login
    localStorage.removeItem("access_token");
    throw new Error('Authentication required. Please log in again.');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};


export const addQuestionAPI = {
  // Submit new question
  async createQuestion(questionData) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/forum/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question');
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  }
};