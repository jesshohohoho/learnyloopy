import { API_ENDPOINTS } from "../../../config/api";
const API_BASE = `${API_ENDPOINTS.leaderboard}`

export const fetchLeaderboardData = async (forceRefresh = false) => {
  const response = await fetch(`${API_BASE}/tutors${forceRefresh ? '?refresh=true' : ''}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error('Failed to load leaderboard data');
  }

  return result;
};