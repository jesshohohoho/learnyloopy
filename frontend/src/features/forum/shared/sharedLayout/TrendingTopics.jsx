
import React from "react";
import comment from "../../../../assets/comment.png";
import like from "../../../../assets/like.png";

export const TrendingTopics = ({ topics, onTopicClick }) => {
  return (
    <div
      style={{
        background: "#F1EDED",
        border: "1px solid #DDD3D3",
        borderRadius: "12px",
        padding: "24px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "16px",
          textAlign: "left",
          color: "#111827"
        }}
      >
        🔥 Trending Topics
      </div>
      
      {topics.length === 0 ? (
        <div style={{ color: "#6B7280", fontSize: "14px" }}>
          No trending topics yet
        </div>
      ) : (
        topics.map((topic, index) => (
          <div key={topic.id} style={{ marginBottom: "20px" }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px"
            }}>
              <div style={{
                minWidth: "24px",
                height: "24px",
                borderRadius: "50%",
                background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop: "2px"
              }}>
                #{index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111827",
                    textAlign: "left",
                    cursor: "pointer",
                    lineHeight: "1.4",
                    marginBottom: "4px",
                    transition: "color 0.2s"
                  }}
                  onClick={() => onTopicClick && onTopicClick(topic.id)}
                  onMouseOver={(e) => e.target.style.color = "#3B82F6"}
                  onMouseOut={(e) => e.target.style.color = "#111827"}
                >
                  {topic.subject || "Trending topic"}
                </div>
                
                {topic.question && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      marginBottom: "8px",
                      textAlign: "left",
                      lineHeight: "1.3"
                    }}
                  >
                    {topic.question.length > 80 ? `${topic.question.substring(0, 80)}...` : topic.question}
                  </div>
                )}
                
                {topic.student_name && (
                  <div style={{
                    fontSize: "12px",
                    color: "#9CA3AF",
                    marginBottom: "8px"
                  }}>
                    by {topic.student_name}
                  </div>
                )}
                
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "13px",
                    color: "#059669",
                    fontWeight: "500"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <img src={like} alt="likes" style={{ width: "16px" }} />
                    <span>{topic.likes || "--"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <img src={comment} alt="comments" style={{ width: "16px" }} />
                    <span>{topic.comments || "--"}</span>
                  </div>
                  {topic.total_engagement > 0 && (
                    <div style={{
                      background: "#10B981",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px"
                    }}>
                      {topic.total_engagement} interactions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
