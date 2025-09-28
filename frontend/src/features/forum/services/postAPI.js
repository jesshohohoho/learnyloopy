import { authenticatedFetch } from "../../../utils/auth";
import { API_ENDPOINTS } from "../../../config/api";
const API_BASE_URL = `${API_ENDPOINTS.forum}`

export const postAPI = {
  // Fetch question details with comments
  async fetchQuestionDetails(questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch question ${questionId}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching question details:", error);
      throw error;
    }
  },

  // Fetch question stats (likes and comments)
  async fetchQuestionStats(questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stats for question ${questionId}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching question stats:", error);
      throw error;
    }
  },

  // Add comment to question
  async addComment(questionId, commentData) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/questions/${questionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Fetch trending topics (highest likes and comments)
  async fetchTrendingTopics() {
    try {
      const response = await fetch(`${API_BASE_URL}/trending`);
      if (!response.ok) {
        throw new Error('Failed to fetch trending topics');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      throw error;
    }
  },


  async toggleLike(questionId) {
      try {
        const response = await authenticatedFetch(`${API_BASE_URL}/questions/${questionId}/like`, {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error('Failed to toggle like');
        }
        return await response.json();
      } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
      }
    },

  async toggleCommentLike(commentId) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to toggle comment like');
      }
      return await response.json();
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  }
  };