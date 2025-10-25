import React, {useState, useEffect} from 'react';
import { Clock, Play, X, Minimize2, Maximize2 } from 'lucide-react';
import { useStudyTimer } from '../hooks/useStudyTimer';

const StudyTimerModal = ({ isOpen, onClose, subjects, onUpdateStudyHours }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // State for draggable position
  const [position, setPosition] = useState({ x: window.innerWidth - 240, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  // handle dragging 
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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

  // Minimized floating widget for running timer
  if (isMinimized && (currentPhase === 'FOCUS' || currentPhase === 'BREAK')) {
    return (
      <div 
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          background: currentPhase === 'FOCUS' ? '#7048FF' : '#FF4D86',
          color: 'white',
          borderRadius: 12,
          padding: '16px 20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab', // ✅ Show drag cursor
          minWidth: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          userSelect: 'none' // ✅ Prevent text selection while dragging
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {currentPhase === 'FOCUS' ? '🎯 Focus Time' : '☕ Break Time'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent drag when clicking button
              setIsMinimized(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Maximize2 size={16} />
          </button>
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ fontSize: 12, textAlign: 'center', opacity: 0.9 }}>
          {subjects.find(s => s.id === selectedSubject)?.name}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      // transparent except for select & success phase to not block other features
        background: (currentPhase === 'SELECT' || currentPhase === 'SUCCESS') 
          ? 'rgba(0,0,0,0.5)' 
          : 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      pointerEvents: (currentPhase === 'SELECT' || currentPhase === 'SUCCESS') ? 'auto' : 'none'
    }}
      onClick={(e) => {
        // Only close on backdrop click for SELECT phase
        if (currentPhase === 'SELECT' && e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 30,
        width: 400,
        maxWidth: '90vw',
        // stick to top right as floating window when timer is running
        position: (currentPhase === 'FOCUS' || currentPhase === 'BREAK') ? 'fixed' : 'relative',
        top: (currentPhase === 'FOCUS' || currentPhase === 'BREAK') ? 20 : 'auto',
        right: (currentPhase === 'FOCUS' || currentPhase === 'BREAK') ? 20 : 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        textAlign: 'center',
        pointerEvents: 'auto',
        zIndex: 1001
      }}>
        {/* Close/Minimize Button */}
        <div style={{
          position: 'absolute',
          top: 15,
          right: 15,
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
          {/* Minimize button (shown when timer is running) */}
            {(currentPhase === 'FOCUS' || currentPhase === 'BREAK') && (
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Minimize"
              >
                <Minimize2 size={20} />
              </button>
            )}

          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: 4,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

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
