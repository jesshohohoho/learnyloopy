import React from "react";
import Png1 from "../../../assets/PP image 1.png";
import Png2 from "../../../assets/PP image 2.png";
import bestSubject from  "../../../assets/bestSubject.png"
import worstSubject from "../../../assets/worstSubject.png"
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

export default function PastPerformancePage({
  timeSpent,
  Accuracy,
  Retention,
  Progress,
}) {
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
    <div style={{
      position: "relative",
      width: "1440px", 
      height: "1028px", 
      background: "#F3F3F3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto" 
    }}>
      <LoadingSpinner message="Fetching performance data for you..." />
    </div>
  );
}

  return (
    <div
      style={{
        position: "relative",
        width: "1440px",
        height: "1028px",
        background: "#F3F3F3",
      }}
    >
      {/* Small Frame */}
      <div
        style={{
          position: "absolute",
          top: "43px",
          left: "44px",
          width: "1210px",
          height: "158px",
          background: "#F1EDED",
          borderRadius: "15px",
          border: "1px solid #DDD3D3",
        }}
      >
        {/* Best Subject - First position */}
        <img
          src={bestSubject}
          alt="Best Subject"
          style={{
            position: "absolute",
            top: "50%",
            left: "33px",
            transform: "translateY(-50%)",
            height: "64px",
            width: "64px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "92px",
            left: "121px",
            color: "#808080",
            justifyContent: "center",
            fontSize: "15px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Best Subject
        </div>
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "121px",
            color: "#7048FF",
            fontSize: "35px",
            justifyContent: "center",
            fontFamily: "Open Sans",
            fontWeight: 700,
            wordWrap: "break-word",
          }}
        >
          {summaryData.bestSubject.name !== "N/A" 
            ? `${summaryData.bestSubject.name}`
            : "N/A"
          }
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "298px",
            width: "1px",
            height: "129px",
            background: "#DDD3D3",
            transform: "translateY(-50%)",
          }}
        ></div>

        {/* Worst Subject - Second position */}
        <img
          src={worstSubject}
          alt="Worst Subject"
          style={{
            position: "absolute",
            top: "50%",
            left: "334px",
            transform: "translateY(-50%)",
            height: "55px",
            width: "55px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "92px",
            left: "414px",
            color: "#808080",
            justifyContent: "center",
            fontSize: "15px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Worst Subject
        </div>
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "414px",
            color: "#7048FF",
            fontSize: "35px",
            justifyContent: "center",
            fontFamily: "Open Sans",
            fontWeight: 700,
            wordWrap: "break-word",
          }}
        >
          {summaryData.worstSubject.name !== "N/A" 
            ? `${summaryData.worstSubject.name}`
            : "N/A"
          }
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "601px",
            width: "1px",
            height: "129px",
            background: "#DDD3D3",
            transform: "translateY(-50%)",
          }}
        ></div>

        {/* Total Study Hours - Third position */}
        <img
          src={Png1}
          alt="Png1"
          style={{
            position: "absolute",
            top: "50%",
            left: "630px",
            transform: "translateY(-50%)",
            height: "64px",
            width: "64px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "92px",
            left: "720px",
            color: "#808080",
            justifyContent: "center",
            fontSize: "15px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Total Study Hours
              (avg)
        </div>
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "720px",
            color: "#7048FF",
            fontSize: "35px",
            justifyContent: "center",
            fontFamily: "Open Sans",
            fontWeight: 700,
            wordWrap: "break-word",
          }}
        >
          {summaryData.avgStudyHours}h
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "905px",
            width: "1px",
            height: "129px",
            background: "#DDD3D3",
            transform: "translateY(-50%)",
          }}
        ></div>

        {/* Mock Test Accuracy - Fourth position */}
        <img
          src={Png2}
          alt="Png2"
          style={{
            position: "absolute",
            top: "50%",
            left: "940px",
            transform: "translateY(-50%)",
            height: "55px",
            width: "55px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "92px",
            left: "1030px",
            color: "#808080",
            justifyContent: "center",
            fontSize: "15px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Mock Test Accuracy (avg)
        </div>
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "1030px",
            color: "#7048FF",
            fontSize: "35px",
            justifyContent: "center",
            fontFamily: "Open Sans",
            fontWeight: 700,
            wordWrap: "break-word",
          }}
        >
          {summaryData.avgMockTest}%
        </div>
      </div>
      {/* Tutoring Outcomes - EXPANDED TO FULL WIDTH */}
      <div
        style={{
          position: "absolute",
          top: "229px",
          left: "46px",
          color: "#2C2C2C",
          fontSize: "24px",
          fontFamily: "Open Sans",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        Tutoring Outcomes
      </div>

      <div
        style={{
          position: "absolute",
          width: "1210px", // Expanded to full width
          height: "321px",
          top: "265px",
          left: "44px",
          background: "linear-gradient(360deg, #ecf0fbff 0%, #F1EDED 95%)",
          borderRadius: 15,
          border: "1px #DDD3D3 solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Chart inside frame */}
        {subjects.filter(
          (subject) =>
            subject.test1 !== null ||
            subject.test2 !== null ||
            subject.assignment !== null ||
            subject.mockTest !== null ||
            subject.totalStudyHours !== null
        ).length > 0 ? (
          <div
            style={{
              width: "1230px",
              height: "351px",
              position: "absolute", // make sure the element is positioned
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)", // shift it back by half its size
            }}
          >
            {" "}
            {/* Increased chart width */}
            <ResponsiveContainer width="100%" height="100%">
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
                margin={{ top: 10, right: 30, left: 10, bottom: 55 }}
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
                  formatter={(value, name, props) => {
                    const formatValue = (val, key) => {
                      if (key === "mockTest") return `${val}%`;
                      if (key === "totalStudyHours") return `${val} hours`;
                      return `${val}/20`;
                    };
                    return [formatValue(value, name), name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload.fullName) {
                      return `Subject: ${payload[0].payload.fullName}`;
                    }
                    return `Subject: ${label}`;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "16px",
                    paddingTop: "1px",
                  }}
                  iconType="rect"
                />
                <Bar
                  dataKey="test1"
                  fill="#9846e5ff"
                  name="Test 1"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={50} // Increased bar size for wider chart
                />
                <Bar
                  dataKey="test2"
                  fill="#2563EB"
                  name="Test 2"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="assignment"
                  fill="#10B981"
                  name="Assignment"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="mockTest"
                  fill="#F97316"
                  name="Mock Test"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="totalStudyHours"
                  fill="#E11D48"
                  name="Study Hours"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          // Empty state when no subjects have performance data
          <div
            style={{
              width: "1180px",
              height: "301px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
              fontSize: "14px",
              fontFamily: "Open Sans",
            }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}
            >
              📊
            </div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              No Performance Data
            </div>
            <div style={{ textAlign: "center", lineHeight: "1.5" }}>
              Add subjects and update their
              <br />
              performance scores to see the chart
            </div>
          </div>
        )}
      </div>

      {/* Past Examinations - MOVED TO BOTTOM WITH NEW STYLING */}
      <div
        style={{
          position: "absolute",
          top: "620px", // Moved to bottom position
          left: "46px",
          color: "#2C2C2C",
          fontSize: "24px",
          fontFamily: "Open Sans",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        Past Examinations
      </div>

      {/* Add Subject Button */}
      <div
        style={{
          padding: "20px 20px 0 20px", // Top padding only
          textAlign: "right",
          position: "absolute",
          top: "595px", // Moved to bottom position
          left: "1100px",
        }}
      >
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: "#7048FF",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "Open Sans",
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
            top: "627px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #DDD3D3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000, // ensure it overlaps
          }}
        >
          <input
            type="text"
            placeholder="Enter subject name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            style={{
              width: "200px",
              padding: "8px",
              border: "1px solid #DDD3D3",
              borderRadius: "4px",
              marginRight: "10px",
              fontFamily: "Open Sans",
            }}
          />
          <button
            onClick={addSubject}
            style={{
              background: "#22C55E",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              marginRight: "8px",
              cursor: "pointer",
              fontFamily: "Open Sans",
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
              fontFamily: "Open Sans",
              fontSize: "12px",
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {/* Subjects Table - FULL WIDTH WITH TUTORING REPORTS STYLE */}
      <div
        style={{
          position: "absolute",
          top: "660px",
          left: "44px",
          width: "1210px",
          height: "300px",
          background: "white", // Directly white, no double background
          borderRadius: "12px",
          border: "3px solid #F3F3F3",
          overflowY: "auto",
        }}
      >
        {/* Subjects Table with Tutoring Reports Style */}
        <div
          style={{
            margin: "0 0 0 0", // Add margins like tutoring reports
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #DDD3D3",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "sans-serif", // Match tutoring reports font
              fontSize: "16px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(360deg, #ecf0fbff 0%, #f6ebffff 95%)",
                  borderBottom: "2px solid #DDD3D3", // Match tutoring reports border
                }}
              >
                <th
                  style={{
                    padding: "16px 24px", // Match py-4 px-6 from tutoring reports
                    textAlign: "center",
                    fontWeight: "600", // Match font-semibold
                    color: "#374151",
                  }}
                >
                  Subject
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Test 1<br />
                  (0-20)
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Test 2<br />
                  (0-20)
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Assignment
                  <br />
                  (0-20)
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Mock Test
                  <br />
                  (0-100%)
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Total Study Hours
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr
                  key={subject.id}
                  style={{
                    borderBottom:
                      index < subjects.length - 1
                        ? "1px solid #F3F4F6"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "16px 24px", // Match tutoring reports padding
                      fontWeight: "600",

                      color: "#7048FF",
                      textAlign: "center", // Center align like tutoring reports
                    }}
                  >
                    {subject.name}
                  </td>

                  {editingSubject?.id === subject.id ? (
                    // Edit mode - keep existing edit functionality
                    <>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.test1 || ""}
                          onChange={(e) =>
                            handleMarkChange("test1", e.target.value)
                          }
                          style={{
                            width: "50px",
                            padding: "4px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "4px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          placeholder="--"
                        />
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.test2 || ""}
                          onChange={(e) =>
                            handleMarkChange("test2", e.target.value)
                          }
                          style={{
                            width: "50px",
                            padding: "4px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "4px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          placeholder="--"
                        />
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editingSubject.assignment || ""}
                          onChange={(e) =>
                            handleMarkChange("assignment", e.target.value)
                          }
                          style={{
                            width: "50px",
                            padding: "4px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "4px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          placeholder="--"
                        />
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                          fontStyle: "italic",
                        }}
                      >
                        {editingSubject.mockTest !== null
                          ? `${editingSubject.mockTest}%`
                          : "--"}
                        <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
                          (Auto-updated)
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={editingSubject.totalStudyHours || ""}
                          onChange={(e) =>
                            handleMarkChange("totalStudyHours", e.target.value)
                          }
                          style={{
                            width: "60px",
                            padding: "4px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "4px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          placeholder="--"
                        />
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <button
                          onClick={saveEdit}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#22C55E",
                            cursor: "pointer",
                            padding: "4px",
                            marginRight: "4px",
                            fontSize: "16px",
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#000000ff",
                            cursor: "pointer",
                            padding: "4px",
                            fontSize: "16px",
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                        }}
                      >
                        {subject.test1 !== null ? subject.test1 : "--"}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                        }}
                      >
                        {subject.test2 !== null ? subject.test2 : "--"}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                        }}
                      >
                        {subject.assignment !== null
                          ? subject.assignment
                          : "--"}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                        }}
                      >
                        {subject.mockTest !== null
                          ? `${subject.mockTest}%`
                          : "--"}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#000000ff",
                        }}
                      >
                        {subject.totalStudyHours !== null
                          ? `${subject.totalStudyHours}h`
                          : "--"}
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center" }}>
                        <button
                          onClick={() => startEditing(subject)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3B82F6",
                            cursor: "pointer",
                            marginRight: "4px",
                            padding: "0.1px",
                            fontSize: "20px",
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            marginRight: "4px",
                            padding: "0.1px",
                            fontSize: "20px",
                          }}
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => predictGradeProbability(subject.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#9333EA",
                            cursor: "pointer",
                            padding: "0.1px",
                            fontSize: "20px",
                          }}
                          title="Predict Performance"
                        >
                          🤖
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {subjects.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
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
            </tbody>
          </table>
        </div>
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
              fontFamily: "Open Sans",
            }}
          >
            <h3
              style={{
                margin: "0 0 5px 0",
                color: "#0369A1",
                fontSize: "28px",
              }}
            >
              Grade Probability Prediction - {selectedSubject?.name}
            </h3>

            {/* Current Performance Display */}
            <div
              style={{
                background: "#ffffffff",
                padding: "5px",
                borderRadius: "8px",
                marginBottom: "20px",
                width: "100%", // makes it full horizontal
                
              }}
            >
              <h4
                style={{
                  margin: "5px 0px 10px 5px",
                  color: "#374151",
                  fontSize: "22px",
                }}
              >
                Current Performance:
              </h4>
              <div style={{ fontSize: "18px" }}>
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
                  fontWeight: "600",
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
                  fontSize: "18px", // Bigger font for closed select
                  backgroundColor: "#F0F9FF",
                  color: "#1E293B",
                  fontWeight: "500",
                  cursor: "pointer",
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
                      fontSize: "18px", // 👈 ensures bigger font in dropdown list
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
                      fontWeight: "700",
                      color: "#0369A1",
                      marginBottom: "10px",
                    }}
                  >
                    Probability of scoring {predictionResult.desired_grade} or
                    above: {predictionResult.percentage.toFixed(1)}%
                  </div>
                  <div style={{ 
                    fontSize: "14px", 
                    color: predictionResult.percentage <= 50 ? "#E11D48" : 
                           predictionResult.percentage <= 80 ? "#F57316" : "#10B981",
                    fontWeight: "600"
                  }}>
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
                  fontFamily: "Open Sans",
                  fontWeight: "600",
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
                  fontFamily: "Open Sans",
                  fontWeight: "600",
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