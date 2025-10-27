import React from "react";
import { useFindTutor } from "../hooks/useFindTutor";
import { useNavigate } from "react-router-dom";

function FindTutor({ onClose }) {
  const navigate = useNavigate();
  const {
    formData,
    updateField,
    findTutor,
    result,
    loading,
    error,
    availableSubjects,
    loadingSubjects,
    availableTeachingStyles,
    loadingTeachingStyles,
  } = useFindTutor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("searchCriteria", JSON.stringify(formData));
    onClose();
    navigate("/recommendation");

    const response = await findTutor();
    if (response.success) {
      localStorage.setItem("recommendedTutors", JSON.stringify(response.data));
    }
  };

  const handleModeToggle = (mode) => updateField("tutoringMode", mode);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      style={{
        overflowY: "auto",  // enable vertical scrolling on small screens
        overflowX: "hidden", // prevent horizontal scrolling
        padding: "40px 0",
      }}
    >
        <div
          className="relative rounded-lg"
          style={{
            width: "574px",
            maxHeight: "90vh", // ✅ modal won’t exceed viewport height
            overflowY: "auto", // ✅ scroll vertically inside modal
            overflowX: "hidden", // 🚫 hide horizontal scroll inside modal
            background: "#F3F3F3",
            borderRadius: "18px",
            padding: "0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            position: "relative",
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
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "80px",
            paddingLeft: "24px",
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "24px",
            background:
              "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Customized Your Experience
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              margin: "0 24px 16px 24px",
              padding: "8px 12px",
              background: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BASIC Section */}
          <div
            style={{
              width: "518px",
              height: "180px",
              margin: "0 24px 24px 24px",
              background: "#F1EDED",
              borderRadius: "15px",
              boxShadow: "2px 2px 6px #DDD3D3",
              padding: "12px 0 0 12px",
            }}
          >
            <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">
              BASIC
            </span>

            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "6px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Name
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
                  color: "#222",
                }}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                type="text"
              />
            </div>

            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Phone Number
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
                  color: "#222",
                }}
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                type="text"
              />
            </div>

            <div className="flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Email Address
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
                  color: "#222",
                }}
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                type="email"
              />
            </div>
          </div>

          {/* PREFERENCE Section */}
          <div
            style={{
              width: "519px",
              minHeight: "320px",
              margin: "0 24px 24px 24px",
              background: "#F1EDED",
              borderRadius: "15px",
              boxShadow: "2px 2px 6px #DDD3D3",
              padding: "12px 0 16px 12px",
            }}
          >
            <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">
              PREFERENCE
            </span>

            {/* Subject dropdown */}
            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Subject
              </span>
              <select
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
                  color: "#222",
                }}
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                disabled={loadingSubjects}
              >
                <option value="">Select a subject</option>
                {availableSubjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Tutoring Mode buttons */}
            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Tutoring Mode
              </span>
              {["Online", "Physical"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  style={{
                    width: "140px",
                    height: "33px",
                    background:
                      formData.tutoringMode === mode ? "#6F48FF" : "#D9D9D9",
                    color: formData.tutoringMode === mode ? "#fff" : "#222",
                    borderRadius: "10px",
                    border: "none",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: formData.tutoringMode === mode ? 600 : 400,
                    fontSize: "18px",
                    marginRight: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleModeToggle(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Other input fields */}
            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Min Experience
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
                  color: "#222",
                }}
                value={formData.minExperience}
                onChange={(e) => updateField("minExperience", e.target.value)}
                type="number"
                placeholder="Enter minimum experience (year)"
              />
            </div>

            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Max Hourly Rate
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
                  color: "#222",
                }}
                value={formData.maxHourlyRate}
                onChange={(e) =>
                  updateField("maxHourlyRate", e.target.value)
                }
                type="number"
                placeholder="Enter maximum hourly rate (RM)"
              />
            </div>

            {/* Teaching Style */}
            <div className="mb-3 flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Teaching Style
              </span>
              <select
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
                  color: "#222",
                }}
                value={formData.teachingStyle}
                onChange={(e) => updateField("teachingStyle", e.target.value)}
                disabled={loadingTeachingStyles}
              >
                <option value="">Select teaching style</option>
                {availableTeachingStyles.map((style, index) => (
                  <option key={index} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Ranking */}
            <div className="flex items-center">
              <span
                style={{
                  width: "157px",
                  minWidth: "157px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#222",
                  margin: "12px 12px 6px 0",
                  textAlign: "left",
                }}
              >
                Ranking
              </span>
              <select
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
                  color: "#222",
                }}
                value={formData.rankingOption}
                onChange={(e) => updateField("rankingOption", e.target.value)}
              >
                <option value="best_overall">Best Overall</option>
                <option value="most_affordable">Most Affordable</option>
                <option value="most_experienced">Most Experienced</option>
                <option value="most_active">
                  Most Active (Highest Credits)
                </option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div
            style={{
              margin: "24px 0",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
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
              }}
            >
              Find Tutor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindTutor;
