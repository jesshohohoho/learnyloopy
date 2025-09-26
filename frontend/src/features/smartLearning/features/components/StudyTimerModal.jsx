import React from 'react';
import { Clock, Play, X } from 'lucide-react';
import { useStudyTimer } from '../hooks/useStudyTimer';

const StudyTimerModal = ({ isOpen, onClose, subjects, onUpdateStudyHours }) => {
  const {
    currentPhase,
    selectedSubject,
    setSelectedSubject,
    timeLeft,
    isRunning,
    FOCUS_TIME,
    BREAK_TIME,
    formatTime,
    startTimer,
    resetModal
  } = useStudyTimer({ subjects, onUpdateStudyHours });

  const handleClose = () => {
    if (isRunning) {
      const confirmClose = window.confirm(
        'Timer is running. Are you sure you want to close? Your progress will be lost.'
      );
      if (!confirmClose) return;
    }
    resetModal();
    onClose();
  };

  const handleDone = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const baseText = { fontFamily: 'Open Sans, sans-serif', color: '#333' };
  const infoText = { ...baseText, color: '#666', marginBottom: 20, textAlign: 'center' };
  const titleText = { ...baseText, fontSize: 24, fontWeight: 600, marginBottom: 20, textAlign: 'center' };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 30,
        width: 400,
        maxWidth: '90vw',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <X size={20} />
        </button>

        {/* SELECT SUBJECT */}
        {currentPhase === 'SELECT' && (
          <div>
            <Clock size={48} color="#7048FF" style={{ marginTop: 15, marginBottom: -10 }} />
            <h2 style={{ ...titleText }}>Study Timer</h2>

            {subjects.length === 0 ? (
              <>
                <p style={infoText}>
                  No subjects available. Please add subjects first in the Past Performance section.
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    background: '#7048FF',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 16
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 20, textAlign: 'left' }}>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1px solid #DDD',
                      borderRadius: 8,
                      fontSize: 16
                    }}
                  >
                    <option value="">Choose a subject...</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={startTimer}
                  disabled={!selectedSubject}
                  style={{
                    background: selectedSubject ? '#7048FF' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    cursor: selectedSubject ? 'pointer' : 'not-allowed',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    margin: '0 auto',
                    marginTop: 35
                  }}
                >
                  <Play size={16} /> Start 25-Minute Study Session
                </button>
              </>
            )}
          </div>
        )}

        {/* FOCUS TIMER */}
        {currentPhase === 'FOCUS' && (
          <div>
            <h2 style={{ ...titleText, color: '#7048FF' }}>Focus Time</h2>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 20
            }}>
              {formatTime(timeLeft)}
            </div>
            <p style={infoText}>
              Studying: <strong>{subjects.find(s => s.id === selectedSubject)?.name}</strong>
            </p>
            <div style={{
              width: '100%',
              background: '#f0f0f0',
              borderRadius: 10,
              height: 8,
              marginBottom: 20
            }}>
              <div style={{
                width: `${((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100}%`,
                background: '#7048FF',
                height: '100%',
                borderRadius: 10,
                transition: 'width 1s ease'
              }} />
            </div>
            <p style={{ fontSize: 14, color: '#999', marginBottom: 0 }}>Stay focused! Break time is coming up.</p>
          </div>
        )}

        {/* BREAK TIMER */}
        {currentPhase === 'BREAK' && (
          <div>
            <h2 style={{ ...titleText, color: '#FF4D86' }}>Break Time</h2>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 20
            }}>
              {formatTime(timeLeft)}
            </div>
            <p style={infoText}>Take a well-deserved break! 🎉</p>
            <div style={{
              width: '100%',
              background: '#f0f0f0',
              borderRadius: 10,
              height: 8,
              marginBottom: 20
            }}>
              <div style={{
                width: `${((BREAK_TIME - timeLeft) / BREAK_TIME) * 100}%`,
                background: '#FF4D86',
                height: '100%',
                borderRadius: 10,
                transition: 'width 1s ease'
              }} />
            </div>
            <p style={{ fontSize: 14, color: '#999', marginBottom: 0 }}>Stretch, hydrate, or just relax!</p>
          </div>
        )}

        {/* SUCCESS */}
        {currentPhase === 'SUCCESS' && (
          <div>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h2 style={{ ...titleText, color: '#FF4D86' }}>Congratulations!</h2>
            <p style={infoText}>
              You have successfully completed your study session for{' '}
              <strong>{subjects.find(s => s.id === selectedSubject)?.name}</strong>
            </p>
            <div style={{
              background: '#f8eef1ff',
              border: '1px solid #FF4D86',
              borderRadius: 8,
              padding: 12,
              marginBottom: 20
            }}>
              <p style={{ margin: 0, color: '#FF4D86' }}><strong>+0.5 study hours added!</strong></p>
            </div>
            <button
              onClick={handleDone}
              style={{
                background: '#FF4D86',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimerModal;
