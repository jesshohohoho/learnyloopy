import { useState, useEffect } from 'react';
import { listTutorAPI } from '../services/listTutorAPI';
import { findTutorAPI } from '../features/services/findTutorAPI';
import {checkAuthAndPrompt} from '../../../utils/authHelpers'

export const useGuidedLearning = () => {
  const [showFindTutor, setShowFindTutor] = useState(false);
  const [showRateTutor, setShowRateTutor] = useState(false);
  const [showBecomeTutor, setShowBecomeTutor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
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
  }, [selectedSubject, searchQuery, allTutors]);

  // Filter tutors based on search query & subject
    const filterTutors = () => {
    let filtered = [...allTutors];

    // Filter by selected subject
    if (selectedSubject) {
      filtered = filtered.filter(tutor => 
        tutor.subject && tutor.subject.includes(selectedSubject)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tutor => 
        tutor.name?.toLowerCase().includes(query) ||
        tutor.subject?.some(s => s.toLowerCase().includes(query)) ||
        tutor.description?.toLowerCase().includes(query)
      );
    }

    setTutors(filtered);
  };


  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load tutors and testimonials 
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

  // Load real subjects taught by tutors
  const loadSubjects = async () => {
    try {
      const subjectsData = await findTutorAPI.getAvailableSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    }
  };

  // Load real tutors and extract testimonials from their reviews
  const loadTutorsAndTestimonials = async () => {
    try {
      // Get top 10 tutors
      const topTutors = await listTutorAPI.getAllTutors(10);
      
      if (!topTutors || topTutors.length === 0) {
        setAllTutors([]);
        setTutors([]);
        setTestimonials([]);
        setSubjects([]);
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
          return "new";
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

      // Extract unique subjects from the top tutors
      const uniqueSubjects = [...new Set(
        processedTutors.flatMap(tutor => tutor.subject || [])
      )].sort();
      setSubjects(uniqueSubjects);

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

      // fall back testtimonials 
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
      setSubjects([]);
    }
  };

  // display tutor avg star rating
  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  // handle subject tag click
  const handleSubjectClick = (subject) => {
    if (selectedSubject === subject) {
      // If clicking the same subject, deselect it (show all)
      setSelectedSubject("");
    } else {
      // Select new subject
      setSelectedSubject(subject);
      setSearchQuery(""); // Clear search when selecting a subject
    }
  };

  const handleFindTutorClick = async () => {
    if(await checkAuthAndPrompt('find a tutor')){
      setShowFindTutor(true);
    }
  };

  const handleRateTutorClick = async () => {
    if(await checkAuthAndPrompt('rate a tutor')){
      setShowRateTutor(true);
    }
  };

  const handleBecomeTutorClick = async () => {
    if(await checkAuthAndPrompt('registered as tutor')){
      setShowBecomeTutor(true);
    }
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
    selectedSubject,
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
    handleSubjectClick,
    getStarRating, 

    refreshData: loadInitialData 
  };
};