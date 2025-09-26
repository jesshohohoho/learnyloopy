import { useState, useEffect } from 'react';
import { listTutorAPI } from '../services/listTutorAPI';
import { findTutorAPI } from '../features/services/findTutorAPI';

export const useGuidedLearning = () => {
  const [showFindTutor, setShowFindTutor] = useState(false);
  const [showRateTutor, setShowRateTutor] = useState(false);
  const [showBecomeTutor, setShowBecomeTutor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [allTutors, setAllTutors] = useState([]); // all tutors
  const [tutors, setTutors] = useState([]); // filtered tutors based on subjects
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [searchQuery, allTutors]);

  const filterTutors = () => {
    if (!searchQuery.trim()) {
      // No search query - show all tutors
      setTutors(allTutors);
      return;
    }

    // Filter tutors based on search query
    const filtered = allTutors.filter(tutor => {
      const query = searchQuery.toLowerCase();
      return (
        tutor.name.toLowerCase().includes(query) ||
        tutor.description.toLowerCase().includes(query) ||
        // Search in subjects if available
        (tutor.subject && tutor.subject.some(subject => 
          subject.toLowerCase().includes(query)
        ))
      );
    });

    setTutors(filtered);
  };


  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load subjects, tutors, and testimonials in parallel
      await Promise.all([
        loadSubjects(),
        loadTutorsAndTestimonials()
      ]);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load real subjects (fallback to static for now)
  const loadSubjects = async () => {
    try {
      const subjectsData = await findTutorAPI.getAvailableSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading subjects:', error);
      // Fallback to static subjects
      setSubjects([
        "Statistics", "Mathematics", "Data Analytics", "Business", "Digital Marketing",
        "Programming", "Cybersecurity", "Language", "Arts", "Law", "History"
      ]);
    }
  };

  // Load real tutors and extract testimonials from their reviews
  const loadTutorsAndTestimonials = async () => {
    try {
      // Get top 6 tutors
      const topTutors = await listTutorAPI.getAllTutors(6);
      
      if (!topTutors || topTutors.length === 0) {
        setAllTutors([]);
        setTutors([]);
        setTestimonials([]);
        return;
      }

      // Get detailed info for each tutor 
      const enrichedData = await Promise.all(
        topTutors.map(async (tutor) => {
          try {
            const details = await listTutorAPI.getTutorDetails(tutor.id);
            return {
              tutor,
              details
            };
          } catch (error) {
            console.error(`Failed to fetch details for tutor ${tutor.id}:`, error);
            return {
              tutor,
              details: null
            };
          }
        })
      );

      // Tutors with details
      const processedTutors = enrichedData.map(({ tutor, details }) => {
        const tutorDetails = details || tutor;
        
        // Create description using template
        const getTeachingStyle = () => {
          if (tutor.teaching_style && Array.isArray(tutor.teaching_style) && tutor.teaching_style.length > 0) {
            return tutor.teaching_style[0];
          }
          return "experienced";
        };

        const getSubject = () => {
          if (tutor.subject && Array.isArray(tutor.subject) && tutor.subject.length > 0) {
            return tutor.subject.join(", ");
          }
          return "various";
        };

        const getTeachingMode = () => {
          if (tutor.teaching_mode && Array.isArray(tutor.teaching_mode) && tutor.teaching_mode.length > 0) {
            return tutor.teaching_mode.join(" and ");
          }
          return "flexible";
        };

        const description = `A ${getTeachingStyle()} tutor with ${tutor.experience || 0} years of teaching and ${tutor.credits || 0} credits. Offers ${getTeachingMode()} sessions for ${getSubject()} courses at RM${tutor.hourly_rate || 'TBD'}/hour.`;

        return {
          id: tutor.id,
          name: tutor.name,
          username: `@${tutor.name.toLowerCase().replace(/\s+/g, '')}`,
          description: description,
          rating: Math.floor(tutor.avg_rating || 0),
          avg_rating: tutor.avg_rating || 0,
          credits: tutor.credits || 0,
          experience: tutor.experience || 0,
          hourly_rate: tutor.hourly_rate || 0,
          latest_review: tutorDetails.latest_review || "No review yet.",
          subject: tutor.subject || [],
        };
      });

      setAllTutors(processedTutors);

      // Extract testimonials from tutors with reviews
      const testimonialsData = [];
      processedTutors.forEach((tutor) => {
        if (tutor.latest_review && 
            tutor.latest_review !== "No review yet." && 
            tutor.latest_review.trim() !== "") {
          testimonialsData.push({
            id: `testimonial-${tutor.id}`,
            text: tutor.latest_review,
            author: `Student of ${tutor.name}`
          });
        }
      });

      // ✅ fall back testtimonials (comments)
      if (testimonialsData.length === 0) {
        testimonialsData.push(
          {
            id: 'fallback-1',
            text: 'Amazing tutor! Really helped me understand complex concepts.',
            author: 'Anonymous Student'
          },
          {
            id: 'fallback-2', 
            text: 'Patient and knowledgeable. Highly recommend!',
            author: 'Anonymous Student'
          },
          {
            id: 'fallback-3',
            text: 'Great teaching style and very supportive throughout the course.',
            author: 'Anonymous Student'
          }
        );
      }

      setTestimonials(testimonialsData);

    } catch (error) {
      console.error('Error loading tutors and testimonials:', error);
      setAllTutors([]);
      setTutors([]);
      setTestimonials([]);
    }
  };

  // display tutor avg star rating
  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  const handleFindTutorClick = () => {
    setShowFindTutor(true);
  };

  const handleRateTutorClick = () => {
    setShowRateTutor(true);
  };

  const handleBecomeTutorClick = () => {
    setShowBecomeTutor(true);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

  };

  return {
    // State
    showFindTutor,
    showRateTutor,
    showBecomeTutor,
    searchQuery,
    subjects,
    tutors,
    testimonials,
    loading, 

    // Actions
    setShowFindTutor,
    setShowRateTutor,
    setShowBecomeTutor,
    handleFindTutorClick,
    handleRateTutorClick,
    handleBecomeTutorClick,
    handleSearchChange,
    getStarRating, 

    refreshData: loadInitialData 
  };
};