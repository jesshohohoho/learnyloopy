// src/features/guidedLearning/components/GuidedLearningPage.jsx
import React, { useEffect, useState } from "react";
import add2 from "../../../assets/add2.png";
import idea from "../../../assets/idea.png";
import FindTutor from "../features/components/FindTutor";
import RateTutor from "../features/components/RateTutor";
import BecomeTutor from "../features/components/BecomeTutor";
import { useGuidedLearning } from "../hooks/useGuidedLearning";
import LoadingSpinner from "../../../components/Loading";

export default function GuidedLearningPage() {
  const {
    showFindTutor,
    showRateTutor,
    showBecomeTutor,
    searchQuery,
    selectedSubject,
    subjects,
    tutors,
    testimonials,
    loading,
    setShowFindTutor,
    setShowRateTutor,
    setShowBecomeTutor,
    handleFindTutorClick,
    handleRateTutorClick,
    handleBecomeTutorClick,
    handleSearchChange,
    handleSubjectClick,
    getStarRating,
  } = useGuidedLearning();

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#F3F3F3",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px", padding: "20px" }}>
          <LoadingSpinner message="Loading amazing tutors for you" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F3F3F3" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "130px",
          padding: "20px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        Sidebar
      </div>

      {/* Main Content */}
      <div
        style={{
          width: "90vw",
          maxWidth: "2000px",
          padding: "20px",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Search Bar */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search a subject..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              width: "100%",
              height: "42px",
              padding: "0 20px",
              borderRadius: "20px",
              border: "1px solid #DDD3D3",
              fontSize: "16px",
              display: "block",
            }}
          />
        </div>

        {/* Horizontal Scrollable Tags */}
        <div
          style={{
            display: "flex",
            gap: "18px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
          className="hide-scrollbar"
        >
          {subjects.length > 0 ? (
            subjects.map((tag) => (
              <span
                key={tag}
                onClick={() => handleSubjectClick(tag)}
                style={{
                  flex: "0 0 auto",
                  background:
                    selectedSubject === tag
                      ? "linear-gradient(90deg, #7048FF 0%, #E69696 100%)"
                      : "rgba(199, 199, 199, 0.3)",
                  borderRadius: "16px",
                  padding: "8px 18px",
                  fontSize: "20px",
                  color: selectedSubject === tag ? "#FFFFFF" : "#000000",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontWeight: selectedSubject === tag ? "600" : "normal",
                }}
              >
                {tag}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "16px", color: "#666", padding: "8px" }}>
              No subjects available
            </span>
          )}
        </div>

        {/* Tutor Match Section */}
        <div style={{ margin: "20px 0" }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "26px",
              marginBottom: "25px",
              lineHeight: "1.2",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedSubject
                ? `${selectedSubject} Tutors`
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Your Perfect Tutor Match — Anytime, Anywhere"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              overflowX: "auto",
              paddingBottom: "16px",
            }}
            className="hide-scrollbar"
          >
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  style={{
                    minWidth: "250px",
                    maxWidth: "304px",
                    height: "320px",
                    background: "#F1EDED",
                    border: "1px solid #DDD3D3",
                    borderRadius: "16px",
                    padding: "18px",
                    textAlign: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "97px",
                        height: "97px",
                        borderRadius: "50%",
                        background: "#E0E7FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "50px",
                        flexShrink: 0,
                        marginTop: "20px",
                      }}
                    >
                      👤
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "20px",
                          marginTop: "30px",
                        }}
                      >
                        {tutor.name}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "12px",
                          padding: "4px 12px",
                          display: "inline-block",
                        }}
                      >
                        {tutor.username}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginLeft: "5px",
                          marginTop: "-5px",
                        }}
                      >
                        <div style={{ color: "#7048FF", fontSize: "20px" }}>
                          {getStarRating(tutor.avg_rating)}
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          ({tutor.avg_rating?.toFixed(1) || "0.0"})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#374151",
                      marginTop: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    "{tutor.description}"
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  fontSize: "16px",
                  color: "#666",
                  textAlign: "center",
                  width: "100%",
                  padding: "40px",
                }}
              >
                No tutors available at the moment
              </div>
            )}
          </div>
        </div>

        {/* Alumni Testimonials */}
        <div style={{ marginBottom: "50px" }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "24px",
              color: "#000000",
              marginBottom: "25px",
              lineHeight: "1.3",
            }}
          >
            Trusted by Thousands — Hear from Our Alumni
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              overflowX: "auto",
              alignItems: "stretch",
            }}
            className="hide-scrollbar"
          >
            {/* Add Review Button */}
            <div
              onClick={handleRateTutorClick}
              style={{
                width: "84px",
                minHeight: "220px",
                flexShrink: 0,
                background: "#F1EDED",
                border: "1px solid #DDD3D3",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E5E1E1";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F1EDED";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img
                src={add2}
                alt="Add Review"
                style={{ width: "30px", height: "30px", objectFit: "contain" }}
              />
            </div>

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                onClick={() => setSelectedTestimonial(testimonial)}
                style={{
                  background: "#F1EDED",
                  border: "1px solid #DDD3D3",
                  borderRadius: "12px",
                  padding: "35px",
                  minWidth: "250px",
                  maxWidth: "300px",
                  height: "220px",
                  textAlign: "center",
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <img
                    src={idea}
                    alt="Light Bulb"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginBottom: "8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#000000",
                    fontStyle: "italic",
                    fontWeight: 600,
                    lineHeight: "1.4",
                    padding: "0 8px",
                    marginBottom: "12px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  "{testimonial.text}"
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: "#7048FF",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Testimonial Modal */}
        {selectedTestimonial && (
          <ModalWrapper onClose={() => setSelectedTestimonial(null)}>
            <div
              style={{
                background: "#F1EDED",
                borderRadius: "12px",
                padding: "30px",
                maxWidth: "500px",
                width: "90%",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div>
                <img
                  src={idea}
                  alt="Light Bulb"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginBottom: "16px",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#000000",
                  fontStyle: "italic",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  marginBottom: "20px",
                }}
              >
                "{selectedTestimonial.text}"
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#7048FF",
                  fontStyle: "italic",
                }}
              >
                {selectedTestimonial.author}
              </div>
            </div>
          </ModalWrapper>
        )}

        {/* Call to Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "clamp(18px, 2vw, 28px)",
              color: "#000",
              marginBottom: "20px",
            }}
          >
            Launch Your Growth Journey Now!
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <button
              onClick={handleFindTutorClick}
              style={{
                flex: "1 1 200px",
                minWidth: "180px",
                background: "rgba(199,199,199,0.3)",
                color: "#000",
                border: "none",
                borderRadius: "24px",
                padding: "10px 25px",
                fontSize: "clamp(16px, 1.5vw, 20px)",
                cursor: "pointer",
                boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7048FF";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(199,199,199,0.3)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "#000000";
              }}
            >
              Learn With Tutor
            </button>

            {handleBecomeTutorClick && (
              <button
                onClick={handleBecomeTutorClick}
                style={{
                  flex: "1 1 200px",
                  minWidth: "180px",
                  background: "rgba(199,199,199,0.3)",
                  color: "#000",
                  border: "none",
                  borderRadius: "24px",
                  padding: "10px 25px",
                  fontSize: "clamp(16px, 1.5vw, 20px)",
                  cursor: "pointer",
                  boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7048FF";
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(199,199,199,0.3)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.color = "#000000";
                }}
              >
                Become A Tutor
              </button>
            )}
          </div>
        </div>

        {/* Modals */}
        {showFindTutor && (
          <ModalWrapper onClose={() => setShowFindTutor(false)}>
            <FindTutor onClose={() => setShowFindTutor(false)} />
          </ModalWrapper>
        )}

        {showRateTutor && (
          <ModalWrapper onClose={() => setShowRateTutor(false)}>
            <RateTutor onClose={() => setShowRateTutor(false)} />
          </ModalWrapper>
        )}

        {showBecomeTutor && BecomeTutor && (
          <ModalWrapper onClose={() => setShowBecomeTutor(false)}>
            <BecomeTutor onClose={() => setShowBecomeTutor(false)} />
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}

// Modal Wrapper
function ModalWrapper({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          borderRadius: "12px",
          width: "80vw",
          maxWidth: "800px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}
