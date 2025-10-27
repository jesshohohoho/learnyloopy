// src/features/tutors/hooks/useFindTutor.js
import { useState, useEffect } from 'react';
import { findTutorAPI } from '../services/findTutorAPI';

export const useFindTutor = () => {
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    tutoringMode: "Online",
    budget: "",
    minExperience: "",
    teachingStyle: [],
    maxHourlyRate: "",
    rankingOption: "best_overall"
  });

  // select subject & style from drop down options
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [availableTeachingStyles, setAvailableTeachingStyles] = useState([]);
  const [loadingTeachingStyles, setLoadingTeachingStyles] = useState(false);   
  const [showTeachingStyleDropdown, setShowTeachingStyleDropdown] = useState(false);

  // Request states
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available subjects
  useEffect(() => {
    fetchSubjects();
    fetchTeachingStyles();
  }, []);

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const subjects = await findTutorAPI.getAvailableSubjects();
      setAvailableSubjects(subjects);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchTeachingStyles = async () => {
    setLoadingTeachingStyles(true);
    try {
      const teachingStyles = await findTutorAPI.getAvailableTeachingStyles();
      setAvailableTeachingStyles(teachingStyles);
    } catch (err) {
      console.error('Failed to fetch teaching styles:', err);
    } finally {
      setLoadingTeachingStyles(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const findTutor = async () => {
    setLoading(true);
    setError("");
    setResult([]);

    try {
      const tutors = await findTutorAPI.findTutor({
        teachingStyle: formData.teachingStyle,
        subject: formData.subject,
        tutoringMode: formData.tutoringMode,
        maxHourlyRate: parseFloat(formData.maxHourlyRate),
        minExperience: parseInt(formData.minExperience),
        rankingOption: formData.rankingOption // rank based on overall similarity, price, experience, or credits
      });

      localStorage.setItem('recommendedTutors', JSON.stringify(tutors));
      setResult(tutors);
      return { success: true, data: tutors };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      tutoringMode: "Online",
      budget: "",
      minExperience: "",
      teachingStyle: [],
      maxHourlyRate: "",
      rankingOption: "best_overall"
    });
    setResult([]);
    setError("");
  };

  return {
    // Form data
    formData,
    updateField,
    
    // Actions
    findTutor,
    resetForm,
    
    // States
    result,
    loading,
    error,
    availableSubjects,
    loadingSubjects,
    availableTeachingStyles,
    loadingTeachingStyles,
    showTeachingStyleDropdown,
    setShowTeachingStyleDropdown
  };
};