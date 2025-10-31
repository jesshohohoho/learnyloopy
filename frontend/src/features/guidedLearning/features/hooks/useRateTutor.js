// src/features/reviews/hooks/useRateTutor.js
import { useState, useEffect } from 'react';
import { rateTutorAPI } from '../services/rateTutorAPI';

export const useRateTutor = (onSuccess) => {
  // Rate tutor form
  const [formData, setFormData] = useState({
    courseName: "",
    tutorName: "", // 
    rating: 0,
    comment: "",
  });

  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  // Request states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch tutors 
  useEffect(() => {
    const fetchTutors = async () => {
      setLoadingTutors(true);
      try {
        const tutorsList = await rateTutorAPI.getAllTutors();
        const sortedTutors = tutorsList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setTutors(sortedTutors);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  // Update available subjects when tutor changes
  useEffect(() => {
    if (formData.tutorName) {
      const subjects = rateTutorAPI.getTutorSubjects(tutors, formData.tutorName);
      setAvailableSubjects(subjects);
      // Reset courseName if it's not in new tutor's subjects
      if (formData.courseName && !subjects.includes(formData.courseName)) {
        setFormData(prev => ({ ...prev, courseName: "" }));
      }
    } else {
      setAvailableSubjects([]);
    }
  }, [formData.tutorName, tutors]);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setRating = (rating) => {
    updateField('rating', rating);
  };

  const submitReview = async () => {
    setLoading(true);
    setMessage("");
    setSuccess(false);
    
    try {
      // Validation
      if (!formData.courseName.trim()) {
        throw new Error("Course name is required");
      }
      if (!formData.tutorName.trim()) {
        throw new Error("Tutor name is required");
      }
      if (formData.rating === 0) {
        throw new Error("Please provide a rating");
      }

      await rateTutorAPI.addReview(formData);
      setSuccess(true);
      setMessage("Review submitted successfully!");
      
      if (onSuccess) {
        await onSuccess();
      }

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000);

      return { success: true };
    } catch (error) {
      console.error('Submit review error:', error);
      setMessage(error.message);
      setSuccess(false);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      tutorName: "",
      rating: 0,
      comment: "",
    });
    setMessage("");
    setSuccess(false);
  };

  return {
    // Form data
    formData,
    updateField,
    setRating,
    
    // Actions
    submitReview,
    resetForm,
    
    // States
    loading,
    message,
    success,

    // Tutors data
    tutors,
    loadingTutors,
    availableSubjects
  };
};