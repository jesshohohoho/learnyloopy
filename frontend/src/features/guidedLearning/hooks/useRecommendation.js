import { useState, useEffect } from 'react';
import { findTutorAPI } from '../features/services/findTutorAPI';
import {supabase} from '../../../lib/supabase'

export const useRecommendation = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

   useEffect(() => {
    const loadRecommendedTutors = async () => {
      try {
        setLoading(true);
        
        // Check if we already have tutors in localStorage
        const storedTutors = localStorage.getItem('recommendedTutors');
        
        if (storedTutors) {
          // We have cached results
          setTutors(JSON.parse(storedTutors));
          setLoading(false);
        } else {
          // We need to search - get criteria and search
          const searchCriteria = localStorage.getItem('searchCriteria');
          
          if (searchCriteria) {
            const criteria = JSON.parse(searchCriteria);
            
            // Perform the actual search here
            const { data, error } = await supabase
              .from('tutors')
              .select('*')
              // Add your filtering logic based on criteria
              .limit(3);
              
            if (error) throw error;
            
            setTutors(data || []);
            // Cache the results
            localStorage.setItem('recommendedTutors', JSON.stringify(data || []));
          }
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

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    
    // Pad with empty stars to make 5 total
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    stars += '☆'.repeat(remainingStars);
    
    return stars;
  };

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