import React, { useState } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import LoadingSpinner from '../../../../components/Loading'; // ADD: Import LoadingSpinner
import './Flashcards.css';

export function Flashcards({ subject, onClose }) {
  const {
    currentCard,
    isFlipped,
    loading,
    error,
    hasCards,
    progress,
    getProgress,
    getFriendlyError,
    goToNext,
    goToPrevious,
    flipCard,
    reviewFlashcard,
    canGoNext,
    canGoPrevious
  } = useFlashcards(subject);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleResponse = async (responseType) => {
    const result = await reviewFlashcard(responseType);
    if (result.isLastCard) {
      setIsCompleted(true);
    }
  };

  // LOADING STATE - Show only LoadingSpinner
  if (loading) {
    return (
      <div className="flashcard-modal-overlay">
        <LoadingSpinner message={`Loading flashcards for ${subject}...`} />
      </div>
    );
  }

  // Error state
  if (error) {
    const friendlyMessage = getFriendlyError();
    return (
      <div className="flashcard-modal-overlay">
        <div className="flashcard-modal">
          <div className="flashcard-header">
            <h2>Flashcards - {subject}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="flashcard-error">
            <div className="error-icon">⚠️</div>
            <h3>{friendlyMessage}</h3>
            <button onClick={onClose} className="close-button">Close</button>
          </div>
        </div>
      </div>
    );
  }

  // No cards state
  if (!hasCards) {
    return (
      <div className="flashcard-modal-overlay">
        <div className="flashcard-modal">
          <div className="flashcard-header">
            <h2>Flashcards - {subject}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="flashcard-empty">
            <p>No flashcards available for {subject}</p>
            <button onClick={onClose} className="close-button">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const progressInfo = getProgress();

  // End page after finishing all cards
  if (isCompleted) {
    return (
      <div className="flashcard-modal-overlay" onClick={onClose}>
        <div className="flashcard-modal" onClick={e => e.stopPropagation()}>
          <div className="flashcard-header">
            <h2>Flashcards Completed!</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div
            className="flashcard-end"
            style={{ lineHeight: '1.4', textAlign: 'center', marginTop: '20px' }}
          >
            <p>
              <strong>Congrats! You have finished all flashcards for {subject}</strong>.
            </p>
            <p>Review your progress or close the window to continue.</p>
            <button
              className="close-button"
              onClick={onClose}
              style={{ marginTop: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-modal-overlay" onClick={onClose}>
      <div className="flashcard-modal" onClick={e => e.stopPropagation()}>
        <div className="flashcard-header">
          <h2>Flashcards - {subject}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="flashcard-progress">
          <div className="progress-info">
            <span>Card {progressInfo.current} of {progressInfo.total}</span>
            <span>{progressInfo.percentage}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressInfo.percentage}%` }}
            ></div>
          </div>
        </div>

        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={flipCard}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h3>Question</h3>
              <div className="card-content">
                <p>{currentCard?.question}</p>
              </div>
              <div className="hint">Click to reveal answer</div>
            </div>
            <div className="flashcard-back">
              <h3>Answer</h3>
              <div className="card-content">
                <p>{currentCard?.answer}</p>
              </div>
              <div className="hint">Click to see question</div>
            </div>
          </div>
        </div>

        <div className="flashcard-response">
          <button className="response-btn again" onClick={() => handleResponse('again')} disabled={!isFlipped}>Again</button>
          <button className="response-btn hard" onClick={() => handleResponse('hard')} disabled={!isFlipped}>Hard</button>
          <button className="response-btn good" onClick={() => handleResponse('good')} disabled={!isFlipped}>Good</button>
          <button className="response-btn easy" onClick={() => handleResponse('easy')} disabled={!isFlipped}>Easy</button>
        </div>

        <div className="flashcard-navigation">
          <button onClick={goToPrevious} disabled={!canGoPrevious}>← Previous</button>
          <button onClick={goToNext} disabled={!canGoNext}>Next →</button>
        </div>

        <div className="flashcard-stats">
          <span className="stat-item">Again: {progress.again}</span>
          <span className="stat-item">Hard: {progress.hard}</span>
          <span className="stat-item">Good: {progress.good}</span>
          <span className="stat-item">Easy: {progress.easy}</span>
        </div>

        <div className="keyboard-shortcuts">
          <p>Shortcuts: Space to flip, 1-4 to rate, Arrows to navigate, Esc to close</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
