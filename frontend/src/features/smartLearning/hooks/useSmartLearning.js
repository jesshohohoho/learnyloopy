import { useState, useEffect } from 'react';
import { askQuestion } from '../services/chatServiceAPI';
import { updateSubjectStudyHours } from '../features/services/studyHoursAPI';
import { subjectsAPI } from '../features/services/subjectsAPI';

export const useSmartLearning = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [messages, setMessages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [showMockTest, setShowMockTest] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState(false)

  // get subjects from database
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Load user's subjects on component mount
  useEffect(() => {
    loadUserSubjects();
  }, []);

  const loadUserSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userSubjects = await subjectsAPI.getUserSubjects();
      console.log('Loaded subjects:', userSubjects);
      
      setSubjects(userSubjects || []);
      
      // Reset selected subject if it's no longer available
      if (selectedSubject && !userSubjects.includes(selectedSubject)) {
        setSelectedSubject('');
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setError('Failed to load subjects');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = async (text) => {
    if (!selectedSubject || !text) {
      alert("Please select a subject and enter a question.");
      return;
    }

    setMessages((prev) => [...prev, { message: text, sender: "user" }]);

    try {
      const data = await askQuestion(selectedSubject, text);
      setMessages((prev) => [
        ...prev,
        { message: data.answer || "No answer received.", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setMessages((prev) => [
        ...prev,
        { message: "Failed to get an answer.", sender: "bot" },
      ]);
    }
  };

  const handleFlashcardsClick = () => {
    if (!selectedSubject) {
      alert("Please select a subject first.");
      return;
    }
    setIsFlashcardsOpen(true);
  };

  const handleUpdateStudyHours = async (subjectName, additionalHours) => {
    try {
      const result = await updateSubjectStudyHours(subjectName, additionalHours);
      
      console.log(`Study hours updated successfully: +${additionalHours} hours`);
      
      return result;
    } catch (error) {
      console.error('Failed to update study hours:', error);
      throw error;
    }
  };

  // ✅ Refresh subjects after upload
  const handleUploadSuccess = () => {
    console.log('Upload successful, refreshing subjects...');
    loadUserSubjects(); // Reload subjects after successful upload
  };

  return {
    // State
    selectedSubject,
    messages,
    isUploadModalOpen,
    isFlashcardsOpen,
    showMockTest,
    subjects,
    showStudyTimer,
    loading,
    error,

    // Actions
    setSelectedSubject,
    handleSendClick,
    handleFlashcardsClick,
    setIsUploadModalOpen,
    setIsFlashcardsOpen,
    setShowMockTest,
    setShowStudyTimer,
    handleUpdateStudyHours,
    handleUploadSuccess,
    loadUserSubjects
  };
};