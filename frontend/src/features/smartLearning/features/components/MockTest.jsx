import React, { useState } from 'react';
import { useMockTest } from '../hooks/useMockTest';
import LoadingSpinner from '../../../../components/Loading';

export function MockTest({ isOpen, onClose, subjectName }) {
  const {
    currentQuestion,
    loading,
    testStarted,
    showResults,
    error,
    hasQuestions,
    startMockTest,
    selectAnswer,
    resetTest,
    calculateScore,
    getProgress,
    submitResult
  } = useMockTest();

  const [isSubmittingResults, setIsSubmittingResults] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const handleStartTest = async () => {
    await startMockTest(subjectName);
  };

  const handleOptionSelect = async (selectedOption) => {
    selectAnswer(selectedOption);
    const progress = getProgress();
    if (progress.current === progress.total) {
      try {
        setIsSubmittingResults(true); // This should trigger second loading state
        const score = calculateScore();

        setFinalScore(score)

        const hasWrongAnswers = score.wrongAnswers && score.wrongAnswers.length > 0;
        await submitResult(subjectName, score.percentage, hasWrongAnswers);
        console.log('Mock test result stored successfully!');
      } catch (error) {
        console.error('Failed to store mock test result:', error);
      } finally {
        setIsSubmittingResults(false);
      }
    }
  };

  const handleClose = () => {
    resetTest();
    setIsSubmittingResults(false); // ADDED: Reset submission state
    setFinalScore(null);
    onClose();
  };

  if (!isOpen) return null;

  // FIXED: Check isSubmittingResults FIRST, then loading
  const isLoadingQuestions = loading && !testStarted; // Only show question loading before test starts
  const isLoadingResults = isSubmittingResults;

  console.log('Loading states:', { 
    loading, 
    testStarted, 
    showResults, 
    isSubmittingResults,
    isLoadingQuestions,
    isLoadingResults
  }); // DEBUG: Add this to see what's happening

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      {/* LOADING STATE 1 - Fetching questions before test starts */}
      {isLoadingQuestions ? (
        <LoadingSpinner message={`Fetching ${subjectName} questions...`} />
      ) : isLoadingResults ? (
        /* LOADING STATE 2 - Submitting results after test completion */
        <LoadingSpinner message="Fetching your result..." />
      ) : (
        // Show modal only when not loading
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80%',
          padding: '30px',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'auto'
        }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>

          {/* Header */}
          <h2 style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#374151',
            fontSize: '24px'
          }}>
            Mock Test - {subjectName}
          </h2>

          {/* Error Display */}
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Start screen */}
          {!testStarted && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                backgroundColor: '#F5F3FF',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{ color: '#7C3AED', marginBottom: '20px' }}>
                  Ready to test your knowledge?
                </h3>
                <p style={{ color: '#374151', marginBottom: '20px', fontSize: '17px' }}>
                  <strong>This mock test will help you evaluate your understanding of {subjectName}</strong>
                </p>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  • Questions are generated based on your study materials<br/>
                  • Click an answer to automatically move to the next question<br/>
                  • Your score will be shown at the end
                </p>
              </div>
              <button
                onClick={handleStartTest}
                style={{
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '15px 35px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(124, 58, 237, 0.8)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#7C3AED';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                Start Test
              </button>
            </div>
          )}

          {/* Question screen */}
          {testStarted && !showResults && hasQuestions && currentQuestion && (
            <div>
              {/* Progress Bar */}
              <div style={{
                backgroundColor: '#E5E5EA',
                borderRadius: '10px',
                height: '10px',
                marginBottom: '10px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)',
                  height: '100%',
                  width: `${getProgress().percentage}%`,
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>

              <p style={{ color: '#4B3F72', fontSize: '14px', textAlign: 'center' }}>
                Question {getProgress().current} of {getProgress().total}
              </p>

              {/* Question frame */}
              <div style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '15px',
                padding: '25px',
                marginBottom: '30px',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #E5E7EB'
              }}>
                <p style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: '#374151',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {currentQuestion.question || 'No question found'}
                </p>
              </div>

              {/* Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                {(currentQuestion.options || []).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      backgroundColor: '#F3F4F6',
                      border: '2px solid #D1D5DB',
                      borderRadius: '12px',
                      padding: '15px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#E5E7EB';
                      e.target.style.borderColor = '#9CA3AF';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#F3F4F6';
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {option || 'No option text'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results screen */}
          {showResults && finalScore && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h3 style={{
                color: '#374151',
                marginBottom: '25px',
                fontSize: '28px'
              }}>
                Test Complete!
              </h3>
              <div style={{
                backgroundColor: '#F5F3FF',
                borderRadius: '15px',
                padding: '40px',
                marginBottom: '30px',
                border: '2px solid #C4B5FD'
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#7C3AED',
                  marginBottom: '15px'
                }}>
                  {finalScore.correct}/{finalScore.total}
                </div>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#7C3AED',
                  marginBottom: '10px'
                }}>
                  {finalScore.percentage}% Correct
                </p>
                <p style={{
                  color: '#6B7280',
                  fontSize: '16px',
                  margin: 0
                }}>
                  {finalScore.percentage >= 80 ? "Excellent work! 🎉" :
                    finalScore.percentage >= 60 ? "Good job! Keep practicing! 👍" :
                      "Keep studying and try again! 📚"}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={resetTest}
                  style={{
                    backgroundColor: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#6D28D9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#7C3AED';
                  }}
                >
                  Take Again
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4B5563';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6B7280';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MockTest;