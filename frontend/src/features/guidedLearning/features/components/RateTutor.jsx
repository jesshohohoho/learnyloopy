import React from "react";
import { useRateTutor } from "../hooks/useRateTutor";
import LoadingSpinner from "../../../../components/Loading"; // ADD: Import LoadingSpinner

function RateTutor({ onClose }) {
  const {
    formData,
    updateField,
    setRating,
    submitReview,
    loading,
    message,
    success
  } = useRateTutor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitReview();
    
    if (result.success) {
      // Auto-close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      {/* Show only LoadingSpinner when submitting */}
      {loading ? (
        <LoadingSpinner message="Submitting your review..." />
      ) : (
        // Show modal only when not loading
        <div
          className="relative rounded-lg"
          style={{
            width: "574px",
            minHeight: "500px",
            background: "#F3F3F3",
            borderRadius: "18px",
            padding: "0",
            boxSizing: "border-box",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "0px",
              right: "-10px",
              fontSize: "28px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
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
              color: "transparent",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Rate Your Experience
          </div>

          <form onSubmit={handleSubmit}>
            {/* Main content section */}
            <div
              style={{
                width: "518px",
                minHeight: "320px",
                margin: "24px 24px 0 24px",
                background: "#F1EDED",
                borderRadius: "15px",
                boxShadow: "2px 2px 6px #DDD3D3",
                padding: "0 0 0 12px",
              }}
            >
              <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">RATING</span>
              
              {/* Registered Course */}
              <div className="mb-3 flex items-center">
                <span style={{
                  width: "157px", 
                  minWidth: "157px", 
                  fontFamily: "Open Sans, sans-serif", 
                  fontWeight: 600, 
                  fontSize: "20px", 
                  color: "#222", 
                  margin: "6px 12px 6px 0", 
                  textAlign: "left"
                }}>
                  Registered Course
                </span>
                <input 
                  style={{
                    width: "307px", 
                    height: "33px", 
                    background: "#D9D9D9", 
                    borderRadius: "10px", 
                    padding: "0 12px", 
                    border: "none", 
                    fontFamily: "Open Sans, sans-serif", 
                    fontWeight: 400, 
                    fontSize: "18px", 
                    color: "#222"
                  }} 
                  value={formData.courseName} 
                  onChange={e => updateField('courseName', e.target.value)} 
                  type="text" 
                  placeholder="Enter course name"
                  required
                />
              </div>

              {/* Your Tutor */}
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
                  Your Tutor
                </span>
                <input 
                  style={{
                    width: "307px", 
                    height: "33px", 
                    background: "#D9D9D9", 
                    borderRadius: "10px", 
                    padding: "0 12px", 
                    border: "none", 
                    fontFamily: "Open Sans, sans-serif", 
                    fontWeight: 400, 
                    fontSize: "18px", 
                    color: "#222"
                  }} 
                  value={formData.tutorName} 
                  onChange={e => updateField('tutorName', e.target.value)} 
                  type="text" 
                  placeholder="Enter tutor name"
                  required
                />
              </div>

              {/* Rating */}
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
                  Rating
                </span>
                <div>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      style={{
                        fontSize: "28px",
                        color: star <= formData.rating ? "#6F48FF" : "#C7C7C7",
                        cursor: "pointer",
                        marginRight: "4px",
                        transition: "color 0.2s ease",
                      }}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={(e) => {
                        if (star > formData.rating) {
                          e.target.style.color = "#9575FF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (star > formData.rating) {
                          e.target.style.color = "#C7C7C7";
                        }
                      }}
                      role="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{
                    marginLeft: "8px",
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "16px",
                    color: "#666"
                  }}>
                    {formData.rating > 0 ? `${formData.rating}/5` : "No rating"}
                  </span>
                </div>
              </div>

              {/* Comment */}
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
                  Comment
                </span>
                <textarea
                  value={formData.comment}
                  onChange={e => updateField('comment', e.target.value)}
                  rows={4}
                  style={{
                    width: "307px",
                    background: "#D9D9D9", 
                    borderRadius: "10px", 
                    padding: "12px", 
                    border: "none", 
                    fontFamily: "Open Sans, sans-serif", 
                    fontWeight: 400, 
                    fontSize: "18px", 
                    color: "#222",
                    resize: "none",
                  }}
                  placeholder="Write your feedback... (optional)"
                />
              </div>

              {/* Message Display */}
              {message && (
                <div style={{ 
                  textAlign: "center", 
                  color: success ? "#2e7d32" : "#d32f2f", 
                  fontWeight: 600,
                  marginTop: "16px",
                  fontFamily: "Open Sans, sans-serif",
                  fontSize: "16px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: success ? "#e8f5e8" : "#ffebee"
                }}>
                  {message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{marginTop: "24px", textAlign: "center", paddingBottom: "24px"}}>
              <button 
                type="submit" 
                style={{
                  padding: "10px 32px", 
                  background: "#6F48FF", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "15px", 
                  fontSize: "18px", 
                  fontWeight: "bold", 
                  cursor: "pointer", 
                  boxShadow: "2px 2px 6px #DDD3D3",
                  transition: "all 0.2s ease"
                }}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default RateTutor;