import React, { useState } from "react";
import CustomChat from "../features/components/CustomChat"
import uploadIcon from "../../../assets/Upload.png";
import pomodoroIcon from "../../../assets/pomodoro.png";
import UploadMaterial from "../features/components/UploadMaterial";
import FlashcardModal from "../features/components/Flashcards";
import MockTest from "../features/components/MockTest";
import { useSmartLearning } from "../hooks/useSmartLearning";
import StudyTimerModal from "../features/components/StudyTimerModal";

// ✅ Reusable standardized button component
const AppButton = ({ onClick, children, isSelected = false }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      maxWidth: "200px",
      height: "50px",
      background: isSelected ? "#7048FF" : "rgba(199, 199, 199, 0.3)",
      color: isSelected ? "#fff" : "#000000",
      border: "none",
      borderRadius: "24px",
      padding: "10px 25px",
      fontSize: "18px",
      fontWeight: isSelected ? 600 : 400,
      cursor: "pointer",
      boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      transition: "all 0.2s ease"
    }}
  >
    {children}
  </button>
);

function SmartLearningPage() {
  const {
    selectedSubject,
    messages,
    isUploadModalOpen,
    isFlashcardsOpen,
    showMockTest,
    subjects,
    showStudyTimer,
    loading,
    error,        
    setSelectedSubject,
    handleSendClick,
    handleFlashcardsClick,
    setIsUploadModalOpen,
    setIsFlashcardsOpen,
    setShowMockTest,
    setShowStudyTimer,    
    handleUpdateStudyHours,
    handleUploadSuccess 
  } = useSmartLearning();

  // ✅ Track which feature button is active
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      height: '100%',
      marginLeft: "135px",              
      width: "calc(99% - 129px)",
      backgroundColor: '#F3F3F3',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* REPLACED: Custom Chat Component */}
      <div className="main-chat-area" style={{marginBottom: '24px'}}>
        <CustomChat
          messages={messages}
          onSendMessage={handleSendClick}
          placeholder="Ask me anything about your studies..."
        />
      </div>

      {/* ✅ Bottom Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '24px',
        height: '247px',
        position: 'relative',
        zIndex: 1,
        width: '100%'
      }}>
        
        {/* Class Materials Card */}
        <div
          style={{
            backgroundColor: '#F1EDED',
            borderRadius: '25px',
            border: '1px solid #DDD3D3',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflowY: "auto"
          }}
        >
          <h3 style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            marginBottom: '5px', 
            textAlign: 'center'  
          }}>
            Pick a subject
          </h3>
          
          {loading ? (
            <div style={{ textAlign: "center", color: "#666" }}>
              Loading subjects...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", color: "#d32f2f" }}>{error}</div>
          ) : subjects.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                fontStyle: "italic"
              }}
            >
              No subjects available.
              <br />
              Upload documents to get started!
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                justifyContent: "center",
                alignContent: "center",
                height: "150px",
                padding: "0 12px"
              }}
            >
              {subjects.map((subject) => (
                <AppButton
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  isSelected={selectedSubject === subject}
                >
                  {subject}
                </AppButton>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img
              src={uploadIcon}
              title="Upload material"
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
              alt="upload"
              onClick={() => setIsUploadModalOpen(true)}
            />
          </div>
        </div>

        {/* Other Features Card */}
        <div
          style={{
            backgroundColor: '#F1EDED',
            borderRadius: '25px',
            border: '1px solid #DDD3D3',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            marginBottom: '20px', 
            textAlign: 'center' 
          }}>
            Test your knowledge
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginBottom: "16px"
          }}>
            <AppButton
              onClick={() => {
                setSelectedFeature("mock");
                setShowMockTest(true);
              }}
              isSelected={selectedFeature === "mock"}
            >
              Mock Test / Quiz
            </AppButton>

            <AppButton
              onClick={() => {
                setSelectedFeature("flashcards");
                handleFlashcardsClick();
              }}
              isSelected={selectedFeature === "flashcards"}
            >
              Flashcards
            </AppButton>
          </div>
          
        </div>

        {/* Pomodoro Timer Card */}
        <div
          style={{
            backgroundColor: '#F1EDED',
            borderRadius: '25px',
            border: '1px solid #DDD3D3',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ 
            fontWeight: 'bold', 
            fontSize: '18px',
            textAlign: 'center' 
          }}>
            Beat the timer
          </h3>
          
          <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <img
              src={pomodoroIcon}
              alt="Pomodoro Timer"
              onClick={() => setShowStudyTimer(true)}
              style={{
                width: "100px",
                height: "100px",
                cursor: "pointer",
                marginTop: "20px",
                objectFit: "contain",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        </div>
        
      </div>

      {/* Upload Material Modal */}
        {isUploadModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', // darker overlay
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999, // make sure it's above sidebar
            }}
            onClick={() => setIsUploadModalOpen(false)}
          >
            <div
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <UploadMaterial 
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>
        )}

      {/* Flashcards Modal */}
      {isFlashcardsOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setIsFlashcardsOpen(false)}
        >
          <FlashcardModal subject={selectedSubject} onClose={() => setIsFlashcardsOpen(false)} />
        </div>
      )}

      {/* Mock Test Modal */}
      <MockTest 
        isOpen={showMockTest}
        onClose={() => setShowMockTest(false)}
        subjectName={selectedSubject}
      />

      {/* Pomodoro Timer Modal */}
      <StudyTimerModal
        isOpen={showStudyTimer}
        onClose={() => setShowStudyTimer(false)}
        subjects={subjects.map(subjectName => ({ 
          id: subjectName,
          name: subjectName 
        }))}
        onUpdateStudyHours={handleUpdateStudyHours}
      />
    </div>
  );
}

export default SmartLearningPage;