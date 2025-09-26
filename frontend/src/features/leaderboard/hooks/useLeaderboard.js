import { useState, useEffect } from 'react';
import { fetchLeaderboardData } from '../services/leaderboardAPI';

export const useLeaderboard = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);

      const result = await fetchLeaderboardData(forceRefresh);
      
      setTutors(result.data);
      setLastUpdated(result.last_updated);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    tutors,
    loading,
    refreshing,
    error,
    lastUpdated,
    fetchLeaderboard
  };
};