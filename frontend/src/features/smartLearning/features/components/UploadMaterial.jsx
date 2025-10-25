import React, { useState, useEffect, useRef } from "react";
import { useUploadMaterial } from "../hooks/useUploadMaterial";
import LoadingSpinner from '../../../../components/Loading';
import { subjectsAPI } from '../services/subjectsAPI';

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

  const [success, setSuccess] = useState(false);
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const inputRef = useRef(null);

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

  const handleSelectSubject = (selectedSubject) => {
    setSubject(selectedSubject);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

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
      setSuccess(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto"
      }}
      onClick={onClose}
    >
      {loading ? (
        <LoadingSpinner message="Uploading your material..." />
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-lg"
          style={{
            width: "100%",
            maxWidth: "500px", // reduced size
            background: "#F3F3F3",
            borderRadius: "18px",
            padding: "0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
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
            <>
              <div
                style={{
                  margin: "36px 24px 24px",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: "bold",
                  fontSize: "24px",
                  background: "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  textAlign: "center"
                }}
              >
                Upload Successful!
              </div>

              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "60px",
                  marginBottom: "24px"
                }}>
                  🎉
                </div>

                <div style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#000",
                  marginBottom: "16px",
                  maxWidth: "300px",
                  lineHeight: "1.3"
                }}>
                  Your material has been uploaded successfully!
                </div>

                <button
                  onClick={onClose}
                  style={{
                    padding: "10px 24px",
                    background: "#7048FF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "2px 2px 6px #DDD3D3"
                  }}
                >
                  Got it!
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                margin: "24px"
              }}>
                <div style={{
                  width: "35px",
                  height: "35px",
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {/* Simple cloud icon */}
                  <svg width="35" height="35" viewBox="0 0 45 45" fill="none">
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

                <div style={{
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: "bold",
                  fontSize: "20px",
                  background: "linear-gradient(90deg, #432B99 12%, #7048FF 40%, #E69696 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}>
                  Upload Class Materials
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{
                  width: "calc(100% - 32px)",
                  maxWidth: "460px",
                  margin: "0 auto",
                  padding: "16px",
                  boxSizing: "border-box",
                  background: "#F1EDED",
                  borderRadius: "12px",
                  boxShadow: "2px 2px 6px #DDD3D3",
                }}>
                  <span style={{ display: "block", fontSize: "14px", fontWeight: "normal", color: "#808080", marginBottom: "8px" }}>
                    UPLOAD
                  </span>

                  {/* Subject input */}
                  <div className="mb-4 flex items-center" style={{ position: "relative" }} ref={inputRef}>
                    <span style={{ width: "100px", fontWeight: 600, fontSize: "18px", color: "#222", marginRight: "8px", marginBottom: "22px" }}>Subject</span>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        maxWidth: "350px",
                        height: "30px",
                        background: "#D9D9D9",
                        borderRadius: "8px",
                        marginBottom: "18px",
                        padding: "0 8px",
                        border: "none",
                        fontSize: "16px",
                        color: "#222"
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

                    {showSuggestions && filteredSubjects.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "32px",
                        left: "108px",
                        width: "calc(100% - 108px)",
                        maxWidth: "350px",
                        maxHeight: "120px",
                        overflowY: "auto",
                        background: "#fff",
                        border: "1px solid #D9D9D9",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        zIndex: 100,
                      }}>
                        {filteredSubjects.map((subj, index) => (
                          <div key={index} onClick={() => handleSelectSubject(subj)}
                               style={{ padding: "6px 8px", cursor: "pointer", fontSize: "14px", color: "#222" }}
                               onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                               onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                          {subj}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload box */}
                  <div style={{
                    width: "420px",
                    height: "250px",
                    margin: "0 auto",
                    background: "#F1EDED",
                    borderRadius: "12px",
                    border: "2px dashed #C7C7C7",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <p style={{ fontSize: "16px", fontWeight: 600, color: "#6F48FF", marginBottom: "8px", textAlign: "center" }}>
                      Choose a file or drag and drop here
                    </p>
                    <p style={{ fontSize: "12px", color: "#808080", textAlign: "center", marginBottom: "12px" }}>
                      .pdf, .txt, .docx only
                    </p>

                    {file && (
                      <p style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#fff",
                        background: "#6F48FF",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        textAlign: "center"
                      }}>
                        Selected: {file.name}
                      </p>
                    )}

                    <label style={{
                      width: "100px",
                      height: "30px",
                      background: "#D9D9D9",
                      borderRadius: "8px",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}>
                      Browse
                      <input type="file" style={{ display: "none" }} onChange={handleFileChange} accept=".pdf,.txt,.docx"/>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
                  <button
                    onClick={handleSubmit}
                    style={{
                      padding: "8px 24px",
                      background: "#6F48FF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 6px #DDD3D3"
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
