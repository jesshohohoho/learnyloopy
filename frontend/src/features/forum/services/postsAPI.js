import { authenticatedFetch } from "../../../utils/auth";
import { API_ENDPOINTS } from "../../../config/api";
const API_BASE_URL = `${API_ENDPOINTS.forum}`


export const postsAPI = {
  // Fetch all questions (require auth depending)
  async fetchQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  // Fetch likes and comments for a specific question
  async fetchQuestionStats(questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/stats`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching stats for question ${questionId}:`, error);
      throw error;
    }
  },


  async fetchTrendingTopics() {
    try {
      const response = await fetch(`${API_BASE_URL}/trending`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      throw error;
    }
  },

  // Example of a POST request with authentication (creating a new question)
  async createQuestion(questionData) {

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        body: JSON.stringify(questionData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  },

  // Example of updating a question (PUT/PATCH request)
  async updateQuestion(questionId, questionData) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(questionData),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating question ${questionId}:`, error);
      throw error;
    }
  }
};