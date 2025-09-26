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
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div
        className="relative rounded-lg"
        style={{
          width: "574px",
          minHeight: "580px",
          background: "#F3F3F3",
          borderRadius: "18px",
          padding: "0",
          boxSizing: "border-box",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          style={{
            position: "absolute",
            top: "0px",
            right: "-10px",
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
              width: "518px",
              minHeight: "400px",
              margin: "24px 24px 0 24px",
              background: "#F1EDED",
              borderRadius: "15px",
              boxShadow: "2px 2px 6px #DDD3D3",
              padding: "0 0 20px 12px",
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
                  width: "307px", 
                  height: "33px", 
                  background: isSubmitting ? "#E5E5E5" : "#D9D9D9", 
                  borderRadius: "10px", 
                  padding: "0 12px", 
                  border: "none", 
                  fontFamily: "Open Sans, sans-serif", 
                  fontWeight: 400, 
                  fontSize: "18px", 
                  color: "#222",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "text"
                }}
                placeholder="e.g., Mathematics, Science, History..."
              />
            </div>

            {/* Question */}
            <div className="flex items-start">
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
                Question
              </span>
              <textarea
                value={newQuestion.question}
                onChange={(e) => updateField('question', e.target.value)}
                required
                disabled={isSubmitting}
                rows={6}
                style={{
                  width: "307px",
                  minHeight: "120px",
                  background: isSubmitting ? "#E5E5E5" : "#D9D9D9", 
                  borderRadius: "10px", 
                  padding: "12px", 
                  border: "none", 
                  fontFamily: "Open Sans, sans-serif", 
                  fontWeight: 400, 
                  fontSize: "18px", 
                  color: "#222",
                  resize: "none",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "text"
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