import { useState, useEffect } from 'react';
import { findTutorAPI } from '../features/services/findTutorAPI';
import {supabase} from '../../../lib/supabase'
import { useGuidedLearning } from './useGuidedLearning';
import { listTutorAPI } from '../services/listTutorAPI';

export const useRecommendation = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { getStarRating } = useGuidedLearning();

   useEffect(() => {
    const loadRecommendedTutors = async () => {
      try {
        setLoading(true);
        
        // load from localStorage (latest search results)
        const storedTutors = localStorage.getItem('recommendedTutors');
        
        if (storedTutors) {
          const parsedTutors = JSON.parse(storedTutors);
          
          // tutors with full details including reviews
          const enrichedTutors = await Promise.all(
            parsedTutors.map(async (tutor) => {
              try {
                const details = await listTutorAPI.getTutorDetails(tutor.id);
                return {
                  ...tutor,
                  latest_review: details?.latest_review || "No review yet.",
                  // Keep other fields from details if needed
                };
              } catch (err) {
                console.error(`Failed to fetch details for tutor ${tutor.id}:`, err);
                return {
                  ...tutor,
                  latest_review: "No review yet."
                };
              }
            })
          );
          setTutors(enrichedTutors);
        } else {
          // If no cached results, show empty
          setTutors([]);
        }
      } catch (err) {
        console.error('Error loading tutors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedTutors();
  }, []);


  const formatDescription = (tutor) => {
    const teachingStyle = Array.isArray(tutor.teaching_style) 
      ? tutor.teaching_style.join(', ') 
      : tutor.teaching_style || 'experienced';
    
    const teachingMode = Array.isArray(tutor.teaching_mode)
      ? tutor.teaching_mode.join(' and ')
      : tutor.teaching_mode || 'online';
    
    const subject = Array.isArray(tutor.subject)
      ? tutor.subject.join(', ')
      : tutor.subject || 'various subjects';

    return `A ${teachingStyle} tutor with ${tutor.experience || 0} years of teaching and ${tutor.credits || 0} credits. Offers ${teachingMode} sessions for ${subject} courses at RM${tutor.hourly_rate || 'TBD'}/hour.`;
  };

  return {
    tutors,
    loading,
    error,
    getStarRating,
    formatDescription
  };
};