// src/features/guidedLearning/components/GuidedLearningPage.jsx

import React from "react";
import add2 from '../../../assets/add2.png' ;
import idea from '../../../assets/idea.png';
import FindTutor from '../features/components/FindTutor';
import RateTutor from "../features/components/RateTutor";
import BecomeTutor from "../features/components/BecomeTutor"
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
    getStarRating
  } = useGuidedLearning();

  if (loading) {
    return (
      <div style={{
        width: "1440px",
        minHeight: "100vh",
        background: "#F3F3F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        position: "relative" // ADD: For proper positioning
      }}>
        <LoadingSpinner message="Loading amazing tutors for you" />
      </div>
    );
  }

  return (
    <div
      className="guided-learning-container"
      style={{
        width: "1440px",
        minHeight: "100vh",
        background: "#F3F3F3",
        padding: "0px",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "hidden",
        margin: "0 auto",
      }}
    >
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "32px 100px 32px 32px", // ✅ Added extra right padding
          boxSizing: "border-box",
        }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: "24px", textAlign: "left" }}>
          <input
            type="text"
            placeholder="Search a subject..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              width: "871px",
              height: "42px",
              flexShrink: 0,
              padding: "0 20px",
              borderRadius: "20px",
              border: "1px solid #DDD3D3",
              fontSize: "16px",
              marginBottom: "16px",
              display: "block",
            }}
          />
        </div>

        {/* Horizontal Scrollable Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "12px",
            paddingBottom: "32px",
            borderRadius: "24px",
            background: "#f3f3f3",
            width: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          {subjects.length > 0 ? subjects.map((tag) => (
            <span
              key={tag}
              onClick={() => handleSubjectClick(tag)}
              style={{
                flex: "0 0 auto",
                background: selectedSubject === tag 
                  ? "linear-gradient(90deg, #7048FF 0%, #E69696 100%)" // Clicked state
                  : "rgba(199, 199, 199, 0.3)", // Unclicked state
                borderRadius: "16px",
                padding: "8px 18px",
                fontSize: "20px",
                color: selectedSubject === tag ? "#FFFFFF" : "#000000", // White text when clicked
                boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
                cursor: "pointer", // clickable
                transition: "all 0.3s ease", 
                fontWeight: selectedSubject === tag ? "600" : "normal", // Bold when clicked
              }}
            >
              {tag}
            </span>
          )) : (
            <span style={{ fontSize: "16px", color: "#666", padding: "8px" }}>
              No subjects available
            </span>
          )}
        </div>


        {/* Tutor Match Section */}
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "25px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedSubject 
                ? `${selectedSubject} Tutors` 
                : searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : '"Your Perfect Tutor Match—Anytime, Anywhere"'
              }
            </span>
          </div>

          {/* Horizontal scrollable tutor cards With fallback */}
          <div
            style={{
              display: "flex",
              gap: "18px",
              overflowX: "auto",
              paddingBottom: "16px",
              paddingRight: "50px",
              scrollbarWidth: "none",
            }}
            className="hide-scrollbar"
          >
            {tutors.length > 0 ? tutors.map((tutor) => (
              <div
                key={tutor.id}
                style={{
                  width: '304px', 
                  height: '301px',
                  background: "#F1EDED",
                  border: "1px solid #DDD3D3",
                  borderRadius: "16px",
                  padding: "18px",
                  textAlign: "center",
                  flex: "0 0 auto",
                }}
              >
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Avatar */}
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
                      marginTop: '20px'
                    }}
                  >
                    👤
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                    <div style={{ fontWeight: 600, fontSize: "20px", marginTop: '30px'}}>
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
                        marginBottom: '18px'
                      }}
                    >
                      {tutor.username}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "18px", color: "#374151", marginBottom: "20px", marginTop: "20px", fontStyle: "italic" }}>
                  "{tutor.description}"
                </div>

                {/* ✅ Updated star rating display */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ color: "#7048FF", fontSize: "28px", textAlign: "left", padding: "4px 0"}}>
                    {getStarRating(tutor.avg_rating)} {/* ✅ Use helper function */}
                  </div>
                  {/* ✅ Show numeric rating */}
                  <div style={{ fontSize: "14px", color: "#666", marginLeft: "4px" }}>
                    ({tutor.avg_rating?.toFixed(1) || '0.0'})
                  </div>
                  
                </div>
              </div>
            )) : (
              // ✅ Fallback when no tutors available
              <div style={{ 
                fontSize: "16px", 
                color: "#666", 
                textAlign: "center", 
                width: "100%",
                padding: "40px" 
              }}>
                No tutors available at the moment
              </div>
            )}
          </div>
        </div>

        {/* Alumni Testimonials */}
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "22.5px",
              color: "#000000",
              marginBottom: "16px",
            }}
          >
            Trusted by Thousands: Hear from Our Alumni
          </div>

          {/* ✅ Horizontal scrollable testimonial cards - With fallback */}
          <div
            style={{
              display: "flex",
              gap: "18px",
              overflowX: "auto",
              paddingBottom: "16px",
              paddingRight: "50px",
              scrollbarWidth: "none",
            }}
            className="hide-scrollbar"
          >
            {/* Add Review Button */}
            <div
              onClick={handleRateTutorClick}
              style={{
                width: "84px",
                height: "210px",
                flexShrink: 0,
                background: "#F1EDED",
                border: "1px solid #DDD3D3",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#E5E1E1";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#F1EDED";
                e.target.style.transform = "scale(1)";
              }}
            >
              <img
                src={add2}
                alt="Add Review"
                style={{ 
                  width: "30px", 
                  height: "30px", 
                  objectFit: "contain",
                  pointerEvents: "none"
                }}
              />
            </div>

            {/* ✅ Testimonials with fallback */}
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                style={{
                  background: "#F1EDED",
                  border: "1px solid #DDD3D3",
                  borderRadius: "12px",
                  padding: "35px",
                  width: "270px",
                  textAlign: "center",
                  flex: "0 0 auto",
                }}
              >
                <div style={{ fontSize: "22px", color: "#A5B4FC", marginBottom: "15px" }}>
                  <img
                    src={idea}
                    alt="Light Bulb"
                    style={{ width: "30px", height: "30px", marginBottom: "8px" }}
                  />
                </div>
                <div style={{ fontSize: "16px", color: "#000000", fontStyle: 'italic', fontWeight: 600, marginBottom: "15px" }}>
                  "{testimonial.text}"
                </div>
                <div style={{ fontSize: "15px", color: "#7048FF", fontStyle: 'italic' }}>
                  {testimonial.author}
                </div>
              </div>
            )) : null /* Testimonials have fallbacks in hook, so this shouldn't happen */}
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div
          style={{
            display: "flex", // ✅ Added flex container
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "22.5px",
              color: "#000000",
              marginBottom: "16px",
            }}
          >
            Launch Your Growing Journey Now!
          </div>
          <div style={{ display: "flex", gap: "32px", justifyContent: "center" }}>
            <button
              onClick={handleFindTutorClick}
              style={{
                background: "rgba(199, 199, 199, 0.3)",
                color: "#000000",
                border: "none",
                borderRadius: "24px",
                padding: "5px 25px",
                fontSize: "20px",
                fontWeight: "normal",
                cursor: "pointer",
                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)"
              }}
            >
              Learn With Tutor
            </button>

            {/* ✅ Add Become Tutor button if you have the functionality */}
            {handleBecomeTutorClick && (
              <button
                onClick={handleBecomeTutorClick}
                style={{
                  background: "rgba(199, 199, 199, 0.3)",
                  color: "#000",
                  border: "none",
                  borderRadius: "24px",
                  padding: "5px 25px",
                  fontWeight: "normal",
                  fontSize: "20px",
                  cursor: "pointer",
                  boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                Become A Tutor
              </button>
            )}
          </div>
        </div>

        

        {/* Find Tutor Modal */}
        {showFindTutor && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setShowFindTutor(false)}
          >
            <div
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                top: '-30%',
                left: '-10%'
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <FindTutor onClose={() => setShowFindTutor(false)} />
            </div>
          </div>
        )}

        {/* Rate Tutor Modal */}
        {showRateTutor && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setShowRateTutor(false)}
          >
            <div
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                top: '-30%',
                left: '-10%'
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <RateTutor onClose={() => setShowRateTutor(false)} />
            </div>
          </div>
        )}

        {/* ✅ Become Tutor Modal (if you have it) */}
        {showBecomeTutor && BecomeTutor && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setShowBecomeTutor(false)}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "transparent",
                top: "-40%",
                left: "-10%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <BecomeTutor onClose={() => setShowBecomeTutor(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}