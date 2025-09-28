const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000',
  },
  production: {
    baseURL: 'https://learnyloopy.onrender.com',
  }
};

// Auto-detect environment
const getEnvironment = () => {
  if (import.meta.env.MODE === 'production' || window.location.hostname !== 'localhost') {
    return 'production';
  }
  return 'development';
};

export const API_BASE_URL = API_CONFIG[getEnvironment()].baseURL;

// Export specific service URLs
export const API_ENDPOINTS = {
  smartLearning: `${API_BASE_URL}/smart-learning`,
  pastPerformance: `${API_BASE_URL}/past-performance`,
  forum: `${API_BASE_URL}/forum`,
  guidedLearning: `${API_BASE_URL}/guided-learning`,
  leaderboard: `${API_BASE_URL}/leaderboard`,
};