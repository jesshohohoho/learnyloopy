import React from "react";
import Png1 from "../../../assets/PP image 1.png";
import Png2 from "../../../assets/PP image 2.png";
import bestSubject from "../../../assets/bestSubject.png";
import worstSubject from "../../../assets/worstSubject.png";
import { getCurrentUserInfo } from "../../../utils/auth";
import { usePastPerformance } from "../hooks/usePastPerformance";
import LoadingSpinner from "../../../components/Loading";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PastPerformancePage() {
  const currentUserInfo = getCurrentUserInfo();
  const {
    subjects,
    loading,
    summaryData,
    editingSubject,
    newSubjectName,
    setNewSubjectName,
    showAddForm,
    setShowAddForm,
    showPredictionModal,
    setShowPredictionModal,
    selectedSubject,
    desiredGrade,
    setDesiredGrade,
    predictionResult,
    setPredictionResult,
    availableGrades,
    predictGradeProbability,
    submitPrediction,
    addSubject,
    saveEdit,
    deleteSubject,
    startEditing,
    handleMarkChange,
    cancelEdit,
  } = usePastPerformance();

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#F3F3F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Fetching performance data for you..." />
      </div>
    );
  }

  const cardData = [
    { icon: bestSubject, label: "Best Subject", value: summaryData.bestSubject?.name || "N/A" },
    { icon: worstSubject, label: "Worst Subject", value: summaryData.worstSubject?.name || "N/A" },
    { icon: Png1, label: "Total Study Hours", value: `${summaryData.totalStudyHours || 0}h` },
    { icon: Png2, label: "Mock Test Accuracy (avg)", value: `${summaryData.avgMockTest || 0}%` },
  ];

  const buttonStyle = {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid #7048FF",
    cursor: "pointer",
    background: "#fff",
    color: "#7048FF",
    fontWeight: 600,
    transition: "all 0.2s",
    minWidth: "60px",
    outline: "none",
  };

  const hoverButtonStyle = {
    background: "#7048FF",
    color: "#fff",
  };

  return (
    <div
      style={{
        marginLeft: "129px",
        width: "calc(99% - 129px)",
        minHeight: "100vh",
        background: "#F3F3F3",
        padding: "25px",
        boxSizing: "border-box",
      }}
    >
      {/* Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          margin: "0 auto 30px auto",
          background: "#F1EDED",
          borderRadius: "15px",
          border: "1px solid #DDD3D3",
          padding: "20px",
          gap: "15px",
          boxSizing: "border-box",
        }}
      >
        {cardData.map((card, idx) => (
          <div
            key={idx}
            style={{
              flex: "1 1 200px",
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <img
              src={card.icon}
              alt={card.label}
              style={{ height: "64px", width: "64px", objectFit: "contain", marginBottom: "10px" }}
            />
            <div
              style={{
                color: "#7048FF",
                fontSize: "28px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "5px",
                wordBreak: "break-word",
              }}
            >
              {card.value}
            </div>
            <div style={{ color: "#808080", fontSize: "15px", fontWeight: 700, textAlign: "center" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tutoring Outcomes */}
      <h2
        style={{
          fontWeight: 700,
          fontSize: "24px",
          color: "#2C2C2C",
          marginBottom: "10px",
          textAlign: "left",
        }}
      >
        Tutoring Outcomes
      </h2>

      <div
        style={{
          width: "100%",
          maxHeight: "330px",
          background: "linear-gradient(360deg, #ecf0fbff 0%, #F1EDED 95%)",
          borderRadius: "15px",
          border: "1px solid #DDD3D3",
          margin: "0 auto 30px auto",
          padding: "20px",
          boxSizing: "border-box",
          overflowX: "auto",
          overflowY: "hidden"
        }}
      >
        {subjects.some(
          (subject) =>
            subject.test1 !== null ||
            subject.test2 !== null ||
            subject.assignment !== null ||
            subject.mockTest !== null ||
            subject.totalStudyHours !== null
        ) ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={subjects
                .filter(
                  (subject) =>
                    subject.test1 !== null ||
                    subject.test2 !== null ||
                    subject.assignment !== null ||
                    subject.mockTest !== null ||
                    subject.totalStudyHours !== null
                )
                .map((subject) => ({
                  subject:
                    subject.name.length > 30
                      ? subject.name.substring(0, 30) + "..."
                      : subject.name,
                  fullName: subject.name,
                  test1: subject.test1 || 0,
                  test2: subject.test2 || 0,
                  assignment: subject.assignment || 0,
                  mockTest: subject.mockTest || 0,
                  totalStudyHours: subject.totalStudyHours || 0,
                }))}
              margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 13, fill: "#181818ff" }}
                angle={-25}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 16, fill: "#181818ff" }}
                domain={[0, "dataMax + 5"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => {
                  if (name === "mockTest") return [`${value}%`, name];
                  if (name === "totalStudyHours") return [`${value} hours`, name];
                  return [`${value}/20`, name];
                }}
                labelFormatter={(label, payload) =>
                  payload && payload[0]?.payload.fullName
                    ? `Subject: ${payload[0].payload.fullName}`
                    : `Subject: ${label}`
                }
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "14px", padding: "0px", margin: 0 }}
              />
              <Bar dataKey="test1" fill="#9846e5ff" name="Test 1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="test2" fill="#2563EB" name="Test 2" radius={[2, 2, 0, 0]} />
              <Bar dataKey="assignment" fill="#10B981" name="Assignment" radius={[2, 2, 0, 0]} />
              <Bar dataKey="mockTest" fill="#F97316" name="Mock Test" radius={[2, 2, 0, 0]} />
              <Bar dataKey="totalStudyHours" fill="#E11D48" name="Study Hours" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>📊</div>
            <div style={{ fontWeight: 600, marginBottom: "8px" }}>No Performance Data</div>
            <div style={{ textAlign: "center", lineHeight: 1.5 }}>
              Add subjects and update their <br /> performance scores to see the chart
            </div>
          </div>
        )}
      </div>

      {/* Past Examinations Header + Add Subject Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: "24px",
            color: "#2C2C2C",
            margin: 0,
            textAlign: "left",
          }}
        >
          Past Examinations
        </h2>

        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: "#7048FF",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ✚ Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #DDD3D3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            width: "90%",
            maxWidth: "400px",
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            placeholder="Enter subject name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #DDD3D3",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button
              onClick={addSubject}
              style={{
                background: "#7048FF",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSubjectName("");
              }}
              style={{
                background: "#6B7280",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Open Sans, sans-serif",
            fontSize: "16px",
            background: "#ffffff2d",
            borderBottom: "1px solid #DDD3D3",
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(360deg, #ecf0fbff 0%, #f6ebffff 95%)",
                borderBottom: "1px solid #DDD3D3",
                borderTop: "1px solid #DDD3D3",
              }}
            >
              {[
                "Subject",
                "Test 1 (0-20)",
                "Test 2 (0-20)",
                "Assignment (0-20)",
                "Mock Test (0-100%)",
                "Total Study Hours",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#6B7280",
                    fontStyle: "italic",
                  }}
                >
                  No subjects added yet. Click "Add Subject" to get started.
                </td>
              </tr>
            )}
            {subjects.map((subject) => {
              const isEditing = editingSubject?.id === subject.id;
              return (
                <tr key={subject.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: 600,
                      color: "#7048FF",
                      textAlign: "center",
                    }}
                  >
                    {subject.name}
                  </td>
                  {isEditing ? (
                    <>
                      {/* Editable fields: test1, test2, assignment */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.test1 ?? ""}
                          onChange={(e) => handleMarkChange("test1", e.target.value)}
                          style={{
                            width: "60px",
                            textAlign: "center",
                            border: "1px solid #DDD3D3",
                            borderRadius: "4px",
                            padding: "4px",
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.test2 ?? ""}
                          onChange={(e) => handleMarkChange("test2", e.target.value)}
                          style={{
                            width: "60px",
                            textAlign: "center",
                            border: "1px solid #DDD3D3",
                            borderRadius: "4px",
                            padding: "4px",
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.assignment ?? ""}
                          onChange={(e) => handleMarkChange("assignment", e.target.value)}
                          style={{
                            width: "60px",
                            textAlign: "center",
                            border: "1px solid #DDD3D3",
                            borderRadius: "4px",
                            padding: "4px",
                          }}
                        />
                      </td>
                      
                      {/* ✅ READ-ONLY fields: mockTest and totalStudyHours */}
                      <td style={{ 
                        padding: "12px", 
                        textAlign: "center",
                        color: "#6B7280",
                        fontStyle: "italic"
                      }}>
                        {editingSubject.mockTest ?? "-"}
                        <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "4px" }}>
                          (Auto-updated)
                        </div>
                      </td>
                      <td style={{ 
                        padding: "12px", 
                        textAlign: "center",
                        color: "#6B7280",
                        fontStyle: "italic"
                      }}>
                        {editingSubject.totalStudyHours ?? "-"}
                        <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "4px" }}>
                          (Auto-updated)
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "12px", textAlign: "center" }}>{subject.test1 ?? "-"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{subject.test2 ?? "-"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{subject.assignment ?? "-"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {subject.mockTest ? `${subject.mockTest}%` : "-"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {subject.totalStudyHours ? `${subject.totalStudyHours}h` : "-"}
                      </td>
                    </>
                  )}
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                            onFocus={(e) => e.target.blur()}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                            onFocus={(e) => e.target.blur()}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(subject)}
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                            onFocus={(e) => e.target.blur()}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSubject(subject.id)}
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                            onFocus={(e) => e.target.blur()}
                          >
                            Delete
                          </button>
                          {/* PREDICT BUTTON */}
                          <button
                            onClick={() => predictGradeProbability(subject.id)}
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                            onFocus={(e) => e.target.blur()}
                          >
                            Predict
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Prediction Modal */}
      {showPredictionModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              fontFamily: "Open Sans, sans-serif",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                margin: "0 0 5px 0",
                color: "#0369A1",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              Grade Probability Prediction - {selectedSubject?.name}
            </h3>

            {/* Current Performance Display */}
            <div
              style={{
                background: "#ffffff",
                padding: "5px",
                borderRadius: "8px",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  margin: "5px 0px 10px 5px",
                  color: "#374151",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                Current Performance:
              </h4>
              <div style={{ fontSize: "18px", lineHeight: "1.8" }}>
                <div style={{ color: "#9846e5ff" }}>
                  • Test 1:{" "}
                  {selectedSubject?.test1 != null
                    ? `${selectedSubject.test1} / 20`
                    : "Not taken"}
                </div>
                <div style={{ color: "#2563EB" }}>
                  • Test 2:{" "}
                  {selectedSubject?.test2 != null
                    ? `${selectedSubject.test2} / 20`
                    : "Not taken"}
                </div>
                <div style={{ color: "#10B981" }}>
                  • Assignment:{" "}
                  {selectedSubject?.assignment != null
                    ? `${selectedSubject.assignment} / 20`
                    : "Not submitted"}
                </div>
                <div style={{ color: "#F97316" }}>
                  • Mock Test:{" "}
                  {selectedSubject?.mockTest != null
                    ? `${selectedSubject.mockTest}%`
                    : "Not taken"}
                </div>
                <div style={{ color: "#E11D48" }}>
                  • Study Hours:{" "}
                  {selectedSubject?.totalStudyHours != null
                    ? `${selectedSubject.totalStudyHours}h`
                    : "0h"}
                </div>
              </div>
            </div>

            {/* Grade Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#0369A1",
                }}
              >
                Select Desired Grade:
              </label>
              <select
                value={desiredGrade}
                onChange={(e) => setDesiredGrade(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0EA5E9",
                  borderRadius: "6px",
                  fontSize: "18px",
                  backgroundColor: "#F0F9FF",
                  color: "#1E293B",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                <option value="" style={{ fontSize: "18px" }}>
                  Choose a grade...
                </option>
                {availableGrades.map((grade) => (
                  <option
                    key={grade}
                    value={grade}
                    style={{
                      fontSize: "18px",
                      padding: "8px",
                    }}
                  >
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Prediction Result */}
            {predictionResult && (
              <>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    color: "#0369A1",
                    fontSize: "22px",
                    fontWeight: 600,
                  }}
                >
                  Prediction Result:
                </h4>
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #0EA5E9",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#0369A1",
                      marginBottom: "10px",
                    }}
                  >
                    Probability of scoring {predictionResult.desired_grade} or above:{" "}
                    {predictionResult.percentage.toFixed(1)}%
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color:
                        predictionResult.percentage <= 50
                          ? "#E11D48"
                          : predictionResult.percentage <= 80
                          ? "#F97316"
                          : "#10B981",
                      fontWeight: 600,
                    }}
                  >
                    {predictionResult.percentage <= 50
                      ? "You need to put more effort"
                      : predictionResult.percentage <= 80
                      ? "Keep going, you're almost there."
                      : "You're on the right track!"}
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={submitPrediction}
                style={{
                  background: "#0369A1",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Predict Probability
              </button>
              <button
                onClick={() => {
                  setShowPredictionModal(false);
                  setDesiredGrade("");
                  setPredictionResult(null);
                }}
                style={{
                  background: "#6B7280",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
