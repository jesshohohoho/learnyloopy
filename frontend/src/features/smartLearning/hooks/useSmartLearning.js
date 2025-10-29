import { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../services/chatServiceAPI';
import { updateSubjectStudyHours } from '../features/services/studyHoursAPI';
import { subjectsAPI } from '../features/services/subjectsAPI';

export const useSmartLearning = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const conversationHistoryRef = useRef([]);
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

  useEffect(() => {
    conversationHistoryRef.current = conversationHistory;
  }, [conversationHistory]);

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
      console.log("No subject selected - using general LLM");
    }

    setMessages((prev) => [...prev, { message: text, sender: "user" }]);

    try {
      // use ref for latest history
      const currentHistory = conversationHistoryRef.current;
      console.log("📤 Sending question:", text);
      console.log("📜 Current history being sent:", currentHistory);
      const data = await askQuestion(
        // if no subject selected, use general as fallback
        selectedSubject || "General", 
        text, 
        currentHistory);
      const botMessage = data.answer || "No answer received.";
      setMessages((prev) => [
        ...prev,
        { message: botMessage, 
          sender: "bot", 
          source: data.source, 
          isGeneral: !selectedSubject
        },
      ]);

      // New Q&A and historical Q&A
      const newEntry = {
        question: text,
        answer: botMessage
      };
      
      const newHistory = [...currentHistory, newEntry].slice(-5);

      setConversationHistory(newHistory);
      conversationHistoryRef.current = newHistory;
        
      console.log("📝 Updated history:", newHistory);

    } catch (error) {
      console.error("Error sending data to backend:", error);
      setMessages((prev) => [
        ...prev,
        { 
          message: error.message || "Failed to get an answer.", 
          sender: "bot",
          isError: true  
        },
      ]);
      }
  };

  // Clear history & messages when changing subjects
  const handleSubjectChange = (newSubject) => {
    if (selectedSubject === newSubject){
      setSelectedSubject("");
    } else{
      setSelectedSubject(newSubject);
    }
    
    setConversationHistory([]); 
    conversationHistoryRef.current = [];
    setMessages([]);  
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

  // Refresh subjects after upload
  const handleUploadSuccess = () => {
    console.log('Upload successful, refreshing subjects...');
    loadUserSubjects(); // Reload subjects after successful upload
  };

  return {
    // State
    selectedSubject,
    messages,
    conversationHistory,
    isUploadModalOpen,
    isFlashcardsOpen,
    showMockTest,
    subjects,
    showStudyTimer,
    loading,
    error,

    // Actions
    setSelectedSubject: handleSubjectChange,
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