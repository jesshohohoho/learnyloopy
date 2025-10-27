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
    success,
    tutors,
    loadingTutors,
    availableSubjects
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
                <select
                  value={formData.tutorName}
                  onChange={e => updateField('tutorName', e.target.value)}
                  disabled={loading || loadingTutors}
                  required
                  style={{
                    width: "307px", 
                    height: "33px", 
                    background: loading || loadingTutors ? "#E5E5E5" : "#D9D9D9", 
                    borderRadius: "10px", 
                    padding: "0 12px", 
                    border: "none", 
                    fontFamily: "Open Sans, sans-serif", 
                    fontWeight: 400, 
                    fontSize: "18px", 
                    color: formData.tutorName ? "#222" : "#888",
                    cursor: loading || loadingTutors ? "not-allowed" : "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "16px",
                    paddingRight: "32px"
                  }} 
                >
                  <option value="" disabled>
                    {loadingTutors ? "Loading tutors..." : "Select a tutor"}
                  </option>
                  {tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.name}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>

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
                <select
                  value={formData.courseName}
                  onChange={e => updateField('courseName', e.target.value)}
                  disabled={loading || !formData.tutorName || availableSubjects.length === 0}
                  required
                  style={{
                    width: "307px", 
                    height: "33px", 
                    background: loading || !formData.tutorName ? "#E5E5E5" : "#D9D9D9", 
                    borderRadius: "10px", 
                    padding: "0 12px", 
                    border: "none", 
                    fontFamily: "Open Sans, sans-serif", 
                    fontWeight: 400, 
                    fontSize: "18px", 
                    color: formData.courseName ? "#222" : "#888",
                    cursor: loading || !formData.tutorName ? "not-allowed" : "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "16px",
                    paddingRight: "32px"
                  }}
                >
                  <option value="" disabled>
                    {!formData.tutorName 
                      ? "Select a tutor first" 
                      : availableSubjects.length === 0 
                      ? "No subjects available" 
                      : "Select a course"}
                  </option>
                  {availableSubjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
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