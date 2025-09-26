// src/features/tutors/components/BecomeTutor.jsx
import React from "react";
import { useBecomeTutor } from "../hooks/useBecomeTutor";
import LoadingSpinner from "../../../../components/Loading"; // ADD: Import LoadingSpinner

function BecomeTutor({ onClose }) {
  const {
    formData,
    updateField,
    handleTeachingModeChange,
    submitTutor,
    loading,
    error,
    success
  } = useBecomeTutor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitTutor();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      {/* Show only LoadingSpinner when loading */}
      {loading ? (
        <LoadingSpinner message="Submitting your application..." />
      ) : (
        // Show modal only when not loading
        <div
          className="relative rounded-lg"
          style={{
            width: "574px",
            height: "725px",
            background: "#F3F3F3",
            borderRadius: "18px",
            padding: "0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
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
              zIndex: 10
            }}
            aria-label="Close"
          >
            ×
          </button>

          {success ? (
            // SUCCESS STATE
            <>
              {/* Title */}
              <div
                style={{
                  margin: "36px 0 24px 24px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: "bold",
                  fontSize: "24px",
                  background: "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Application Submitted!
              </div>

              {/* Success Content */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "80px",
                  marginBottom: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%"
                }}>
                  🎉
                </div>

                <div style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#000000",
                  marginBottom: "40px",
                  fontFamily: "Open Sans, sans-serif",
                  textAlign: "center",
                  maxWidth: "400px",
                  lineHeight: "1.3"
                }}>
                  Your tutor profile has been submitted successfully!
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%"
                }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: "12px 32px",
                      background: "#7048FF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "15px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 6px #DDD3D3",
                      fontFamily: "Open Sans, sans-serif"
                    }}
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </>
          ) : (
            // FORM STATE
            <>
              {/* Title */}
              <div
                style={{
                  margin: "36px 0 24px 24px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: "bold",
                  fontSize: "24px",
                  background: "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Become a Tutor
              </div>

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    margin: "0 24px 12px 24px",
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

              {/* Form wrapper */}
              <div style={{ 
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <form onSubmit={handleSubmit} style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1
                }}>
                  {/* Content wrapper */}
                  <div style={{ flex: 1 }}>
                    
                    {/* BASIC Section */}
                    <div
                      style={{
                        width: "518px",
                        margin: "0 24px 24px 24px",
                        background: "#F1EDED",
                        borderRadius: "15px",
                        boxShadow: "2px 2px 6px #DDD3D3",
                        padding: "12px",
                      }}
                    >
                      <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">
                        BASIC
                      </span>

                      {[
                        { label: "Full Name", field: "name", type: "text" },
                        { label: "Phone Number", field: "phone", type: "text" },
                      ].map((input, idx) => (
                        <div className="mb-3 flex items-center" key={idx}>
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
                            {input.label}
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
                            value={formData[input.field]}
                            onChange={(e) => updateField(input.field, e.target.value)}
                            type={input.type}
                            required={input.field === "name"}
                          />
                        </div>
                      ))}
                    </div>

                    {/* DETAILS Section */}
                    <div
                      style={{
                        width: "518px",
                        margin: "0 24px 0 24px",
                        background: "#F1EDED",
                        borderRadius: "15px",
                        boxShadow: "2px 2px 6px #DDD3D3",
                        padding: "12px",
                      }}
                    >
                      <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">
                        DETAILS
                      </span>

                      {/* Regular input fields */}
                      {[
                        { label: "Subjects You Teach", field: "subjects", type: "text", placeholder: "e.g. Math, Science, English" },
                        { label: "Years of Experience", field: "experience", type: "number", placeholder: "Enter years" },
                        { label: "Hourly Rate (RM)", field: "hourlyRate", type: "number", placeholder: "Enter rate" },
                      ].map((input, idx) => (
                        <div className="mb-3 flex items-center" key={idx}>
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
                            {input.label}
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
                            value={formData[input.field]}
                            onChange={(e) => updateField(input.field, e.target.value)}
                            type={input.type}
                            placeholder={input.placeholder}
                            required
                          />
                        </div>
                      ))}

                      {/* Teaching Mode Checkboxes */}
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
                          Teaching Mode
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", gap: "16px", alignItems: "center" }}>
                          {["Online", "Physical"].map((mode) => (
                            <label
                              key={mode}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                fontFamily: "Open Sans, sans-serif",
                                fontSize: "16px",
                                color: "#222",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={formData.teachingMode.includes(mode)}
                                onChange={() => handleTeachingModeChange(mode)}
                                style={{
                                  marginRight: "6px",
                                  cursor: "pointer",
                                }}
                              />
                              {mode}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div style={{ 
                    padding: "24px 0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "80px"
                  }}>
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
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BecomeTutor;