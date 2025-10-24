import React, { useState, useEffect, useRef } from "react";
import { useUploadMaterial } from "../hooks/useUploadMaterial";
import LoadingSpinner from '../../../../components/Loading';
import {subjectsAPI} from '../services/subjectsAPI'

const UploadMaterial = ({ onClose, onUploadSuccess }) => {
  const {
    subject,
    setSubject,
    file,
    handleFileChange,
    uploadMaterial,
    loading,
    error
  } = useUploadMaterial(onUploadSuccess);

  const [success, setSuccess] = useState(false); // ADD: Success state

  // NEW: Autocomplete states
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const inputRef = useRef(null);

  // NEW: Fetch existing subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await subjectsAPI.getUserSubjects();
        setExistingSubjects(subjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // NEW: Handle subject input change with autocomplete
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);

    if (value.trim()) {
      const filtered = existingSubjects.filter(subj =>
        subj.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSubjects(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // NEW: Handle subject selection from dropdown
  const handleSelectSubject = (selectedSubject) => {
    setSubject(selectedSubject);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // NEW: Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    try {
      await uploadMaterial();
      setSuccess(true); // CHANGED: Set success state instead of alert
    } catch (error) {
      // Keep error handling as is
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      {/* show loading gif, only show upload modal when not loading */}
      {loading ? (
        <LoadingSpinner message="Uploading your material..." />
      ) : (

        <div
          className="relative rounded-lg"
          style={{
            width: "574px",
            height: "580px",
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
                Upload Successful!
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
                {/* Success Icon */}
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

                {/* Success Message */}
                <div style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#000000",
                  marginBottom: "16px",
                  fontFamily: "Open Sans, sans-serif",
                  textAlign: "center",
                  maxWidth: "400px",
                  lineHeight: "1.3"
                }}>
                  Your material has been uploaded successfully!
                </div>

                {/* Close Button */}
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
              {/* Title with icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "36px 0 0 24px",
                }}
              >
                {/* Cloud upload icon */}
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    marginRight: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
                    <path
                      d="M36 19.5C36 16.5 34.5 14 32 12.5C30.5 9.5 27.5 7.5 24 7.5C19.5 7.5 15.5 10.5 14.5 14.5C11.5 14.5 9 17 9 20C9 23 11.5 25.5 14.5 25.5H35C37.5 25.5 39.5 23.5 39.5 21C39.5 18.5 37.5 16.5 35 16.5C35.5 17.5 36 18.5 36 19.5Z"
                      stroke="#6F48FF"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M24 30V16" stroke="#6F48FF" strokeWidth="2" />
                    <path
                      d="M20 20L24 16L28 20"
                      stroke="#6F48FF"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                <div
                  style={{
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
                  Upload Class Materials
                </div>
              </div>

              {/* Form wrapper */}
              <div style={{ 
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                {/* Main content section */}
                <div
                  style={{
                    width: "518px",
                    minHeight: "355px",
                    margin: "24px 24px 0 24px",
                    background: "#F1EDED",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 6px #DDD3D3",
                    padding: "0 0 20px 12px",
                  }}
                >
                  <span className="text-[#808080] text-[15px] font-bold mb-3 block text-left">
                    UPLOAD
                  </span>

                  {/* Subject Input */}
                  <div className="mb-6 flex items-center" style={{ position: "relative" }} ref={inputRef}>
                    <span
                      style={{
                        width: "140px",
                        minWidth: "140px",
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        color: "#222",
                        margin: "6px 12px 24px 0",
                        textAlign: "left",
                      }}
                    >
                      Subject
                    </span>
                    <input
                      type="text"
                      style={{
                        width: "324px",
                        height: "33px",
                        background: "#D9D9D9",
                        borderRadius: "10px",
                        padding: "0 12px",
                        border: "none",
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 400,
                        fontSize: "18px",
                        color: "#222",
                        margin: "6px 0 24px 0",
                      }}
                      placeholder="Type subject here"
                      value={subject}
                      onChange={handleSubjectChange}
                      onFocus={() => {
                        if (subject.trim() && filteredSubjects.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                    />

                    {/* Autocomplete Dropdown */}
                      {showSuggestions && filteredSubjects.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "39px",
                            left: "0",
                            width: "100%",
                            maxHeight: "150px",
                            overflowY: "auto",
                            background: "#fff",
                            border: "1px solid #D9D9D9",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            zIndex: 100,
                          }}
                        >
                          {filteredSubjects.map((subj, index) => (
                            <div
                              key={index}
                              onClick={() => handleSelectSubject(subj)}
                              style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontFamily: "Open Sans, sans-serif",
                                fontSize: "16px",
                                color: "#222",
                                borderBottom: index < filteredSubjects.length - 1 ? "1px solid #f0f0f0" : "none",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f5f5f5";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#fff";
                              }}
                            >
                              {subj}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Upload Box */}
                  <div
                    style={{
                      width: "470px",
                      height: "260px",
                      margin: "0 12px 0 12px",
                      background: "#F1EDED",
                      borderRadius: "15px",
                      border: "2px dashed #C7C7C7",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 600,
                        color: "#6F48FF",
                        fontSize: "20px",
                        textAlign: "center",
                        margin: "0 0 16px 0",
                      }}
                    >
                      Choose a file or drag and drop it here.
                    </p>

                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 400,
                        color: "#808080",
                        fontSize: "15px",
                        textAlign: "center",
                        margin: "0 0 24px 0",
                      }}
                    >
                      .pdf, .txt, or .docx only
                    </p>

                    {/* Show selected file name if file exists */}
                    {file && (
                      <p
                        style={{
                          fontFamily: "Open Sans, sans-serif",
                          fontWeight: 500,
                          color: "#ffffff",
                          fontSize: "14px",
                          textAlign: "center",
                          margin: "0 0 16px 0",
                          background: "#6F48FF",
                          padding: "4px 8px",
                          borderRadius: "8px"
                        }}
                      >
                        Selected: {file.name}
                      </p>
                    )}

                    <label
                      style={{
                        width: "120px",
                        height: "35px",
                        background: "#D9D9D9",
                        borderRadius: "10px",
                        border: "none",
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 500,
                        color: "#222",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      Browse file
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".pdf,.txt,.docx"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button - FIXED: Vertically centered in bottom area */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80px", // FIXED: Fixed height instead of minHeight
                    margin: "12px 0 24px 0" // FIXED: Push to bottom with equal spacing
                  }}
                >
                  <button
                    onClick={handleSubmit}
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
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadMaterial;