// src/features/reviews/hooks/useRateTutor.js
import { useState } from 'react';
import { rateTutorAPI } from '../services/rateTutorAPI';

export const useRateTutor = () => {
  // Form states - changed tutorID to tutorName
  const [formData, setFormData] = useState({
    courseName: "",
    tutorName: "", // Changed from tutorID to tutorName
    rating: 0,
    comment: "",
  });

  // Request states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
    success
  };
};