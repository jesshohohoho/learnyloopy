import { useState, useEffect } from 'react';

export const useStudyTimer = ({ subjects, onUpdateStudyHours }) => {
  const [currentPhase, setCurrentPhase] = useState('SELECT'); // SELECT SUBJECT, START TIMER, BREAK, STUDY SESSION ENDS
  const [selectedSubject, setSelectedSubject] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Use less time for testing
  const TESTING_MODE = true;
  // Timer intervals (in seconds)
  const FOCUS_TIME = TESTING_MODE ? 5 : 25 * 60; // 25 minutes
  const BREAK_TIME = TESTING_MODE ? 1: 5 * 60;  // 5 minutes

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      if (currentPhase === 'FOCUS') {
        // Focus complete, start break
        setCurrentPhase('BREAK');
        setTimeLeft(BREAK_TIME);
      } else if (currentPhase === 'BREAK') {
        // Break complete, finish session
        setIsRunning(false);
        handleSessionComplete();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = () => {
    if (!selectedSubject) {
      alert('Please select a subject first');
      return;
    }
    
    setCurrentPhase('FOCUS');
    setTimeLeft(FOCUS_TIME);
    setIsRunning(true);
  };

  // Handle session completion
  const handleSessionComplete = async () => {
    try {
      // Update study hours (+0.5)
      await onUpdateStudyHours(selectedSubject, 0.5);
      setCurrentPhase('SUCCESS');
    } catch (error) {
      console.error('Failed to update study hours:', error);
      alert('Failed to save study time. Please try again.');
    }
  };

  // Reset modal state
  const resetModal = () => {
    setCurrentPhase('SELECT');
    setSelectedSubject('');
    setTimeLeft(0);
    setIsRunning(false);
  };

  return {
    currentPhase,
    selectedSubject,
    setSelectedSubject,
    timeLeft,
    isRunning,
    FOCUS_TIME,
    BREAK_TIME,
    formatTime,
    startTimer,
    handleSessionComplete,
    resetModal,
    subjects
  };
};