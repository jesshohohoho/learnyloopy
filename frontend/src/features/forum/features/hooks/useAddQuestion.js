// forum/features/hooks/useAddQuestion.js
import { useState } from "react";
import { addQuestionAPI } from "../services/addQuestionAPI";

export const useAddQuestion = ({ onQuestionAdded, onClose }) => {
  const [newQuestion, setNewQuestion] = useState({
    subject: "",
    question: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Update form field
  const updateField = (field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Reset form
  const resetForm = () => {
    setNewQuestion({
      subject: "",
      question: ""
    });
    setError(null);
  };

  // Submit question
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    // Validation
    if (
        !newQuestion.subject.trim() || 
        !newQuestion.question.trim()) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const createdQuestion = await addQuestionAPI.createQuestion(newQuestion);
      
      // Reset form and notify parent
      resetForm();
      onQuestionAdded(createdQuestion);
      onClose();
      
      // Success notification - you might want to use a toast library instead
      alert("Question posted successfully!");
    } catch (error) {
      setError(error.message || "Failed to post question. Please try again.");
      console.error("Error creating question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return {
    // State
    newQuestion,
    isSubmitting,
    error,
    
    // Actions
    updateField,
    handleSubmitQuestion,
    handleClose,
    resetForm
  };
};