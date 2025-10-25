// forum/features/components/AddQuestion.jsx
import React from "react";
import { useAddQuestion } from "../hooks/useAddQuestion";

export default function AddQuestion({ isOpen, onClose, onQuestionAdded }) {
  const {
    newQuestion,
    isSubmitting,
    error,
    updateField,
    handleSubmitQuestion,
    handleClose
  } = useAddQuestion({ onQuestionAdded, onClose });

  if (!isOpen) return null;

  return (
    // click outside to close
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto" // Allow scrolling
      }}
      onClick={handleClose}
    >
      <div
        className="relative rounded-lg"
         onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
        style={{
          width: "100%",
          maxWidth: "574px",
          minHeight: "580px",
          background: "#F3F3F3",
          borderRadius: "18px",
          padding: "0",
          boxSizing: "border-box",
          maxHeight: "90vh", 
          overflowY: "auto",
          margin: "auto" 
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            fontSize: "28px",
            background: "none",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            color: "#888",
            opacity: isSubmitting ? 0.5 : 1,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <div
          style={{
            display: "inline-block",
            margin: "36px 0 0 24px",
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "24px",
            background: "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent"
          }}
        >
          Ask a Question
        </div>

        <form onSubmit={handleSubmitQuestion}>
          {/* Main content section */}
          <div
            style={{
              width: "calc(100% - 48px)", // Responsive
              maxWidth: "518px", 
              minHeight: "400px",
              margin: "24px auto 0",
              background: "#F1EDED",
              borderRadius: "15px",
              boxShadow: "2px 2px 6px #DDD3D3",
              padding: "20px 12px",
              boxSizing: "border-box"
            }}
          >
            <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">QUESTION</span>
            
            {/* Error Message */}
            {error && (
              <div style={{
                background: "#FEE2E2",
                color: "#DC2626",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                marginBottom: "16px",
                border: "1px solid #FECACA"
              }}>
                {error}
              </div>
            )}
            

            {/* Subject */}
            <div className="mb-3 flex items-center">
              <span style={{
                width: "157px", 
                minWidth: "157px", 
                fontFamily: "Open Sans, sans-serif", 
                fontWeight: 600, 
                fontSize: "20px", 
                color: "#222", 
                margin: "12px 12px 6px 0", 
                textAlign: "left"
              }}>
                Subject
              </span>
              <input
                type="text"
                value={newQuestion.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                required
                disabled={isSubmitting}
                style={{
                  width: "100%", 
                  maxWidth: "307px", // flexible width with bound
                  height: "33px", 
                  marginTop: "8px",
                  background: isSubmitting ? "#E5E5E5" : "#D9D9D9", 
                  borderRadius: "10px", 
                  padding: "0 12px", 
                  border: "none", 
                  fontFamily: "Open Sans, sans-serif", 
                  fontWeight: 400, 
                  fontSize: "17px", 
                  color: "#222",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "text",
                  boxSizing: "border-box"
                }}
                placeholder="e.g., Mathematics, Science, History..."
              />
            </div>

            {/* Question */}
            <div className="flex items-start">
              <span style={{
                width: "157px", 
                marginTop: "8px",
                minWidth: "157px", 
                fontFamily: "Open Sans, sans-serif", 
                fontWeight: 600, 
                fontSize: "20px", 
                color: "#222", 
                margin: "12px 12px 6px 0", 
                textAlign: "left"
              }}>
                Question
              </span>
              <textarea
                value={newQuestion.question}
                onChange={(e) => updateField('question', e.target.value)}
                required
                disabled={isSubmitting}
                rows={6}
                style={{
                  width: "100%", 
                  maxWidth: "307px", 
                  minHeight: "300px",
                  background: isSubmitting ? "#E5E5E5" : "#D9D9D9", 
                  marginTop: "12px",
                  borderRadius: "10px", 
                  padding: "12px", 
                  border: "none", 
                  fontFamily: "Open Sans, sans-serif", 
                  fontWeight: 350, 
                  fontSize: "17px", 
                  color: "#222",
                  resize: "none",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "text",
                  boxSizing: "border-box"
                }}
                placeholder="Describe your question in detail..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{marginTop: "24px", textAlign: "center", paddingBottom: "24px"}}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                padding: "10px 32px", 
                background: isSubmitting ? "#ccc" : "#6F48FF", 
                color: "#fff", 
                border: "none", 
                borderRadius: "15px", 
                fontSize: "18px", 
                fontWeight: "bold", 
                cursor: isSubmitting ? "not-allowed" : "pointer", 
                boxShadow: "2px 2px 6px #DDD3D3",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.2s ease"
              }}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}