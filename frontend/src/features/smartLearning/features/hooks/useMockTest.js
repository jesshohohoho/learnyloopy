
import { useState } from 'react';
import { mockTestAPI, storeMockTestResult, getMockTestResult, getAllMockTestResults } from '../services/mockTestAPI';

export const useMockTest = () => {
  // Test state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const [currentResult, setCurrentResult] = useState(null);
  const [allResults, setAllResults] = useState([]);

  const startMockTest = async (subjectName) => {
    setLoading(true);
    setError("");
    
    try {
      const mockTestData = await mockTestAPI.getMockTest(subjectName);
      
      setQuestions(mockTestData);
      setTestStarted(true);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    const wrongAnswers = []; // Add this array
    
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].answer) {
        correct++;
      } else {
        // Collect wrong answers for flashcard creation
        wrongAnswers.push({
          question: questions[i].question,
          answer: questions[i].answer, // The correct answer
          user_answer: userAnswers[i] || "No answer",
          options: questions[i].options // Optional: keep for reference
        });
      }
    }
    
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      wrongAnswers // Add this to the return
    };
  };

  const resetTest = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestStarted(false);
    setShowResults(false);
    setError("");
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex] || null;
  };

  const getProgress = () => {
    return {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    };
  };

   const submitResult = async (subjectName, createFlashcards = false) => {
    setLoading(true);
    setError("");
    try {
      const scoreData = calculateScore(); // Get the wrong answers
      
      const response = await storeMockTestResult(subjectName, {
        result_percentage: scoreData.percentage,
        wrong_answers: scoreData.wrongAnswers, // Send wrong answers
        create_flashcards_from_wrong: createFlashcards // Send flashcard option
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getResult = async (subjectName) => {
    setLoading(true);
    setError("");
    try {
      const response = await getMockTestResult(subjectName);
      setCurrentResult(response);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllResults = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllMockTestResults();
      setAllResults(response.results || []);
      return response.results;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Test data
    questions,
    currentQuestion: getCurrentQuestion(),
    userAnswers,
    
    // Actions
    startMockTest,
    selectAnswer,
    resetTest,
    
    // Computed values
    calculateScore,
    getProgress,
    
    // UI states
    loading,
    testStarted,
    showResults,
    error,
    
    // Current state info
    currentQuestionIndex,
    hasQuestions: questions.length > 0,

    currentResult,
    allResults,
    submitResult,
    getResult,
    getAllResults
  };
};