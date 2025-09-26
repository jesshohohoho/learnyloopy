
import React from "react";
import question from "../../../../assets/question.png";
import internet from "../../../../assets/internet.png";
import correct from "../../../../assets/correct.png";
import wrong from "../../../../assets/wrong.png"

export const InvolvementSection = ({ onItemClick }) => {
  const involvementItems = [
    { id: 1, label: "My Question", icon: question },
    { id: 2, label: "My Participation", icon: internet },
    { id: 3, label: "Solved", icon: correct },
    { id: 4, label: "Unsolved", icon: wrong },
  ];

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
        Involvement
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {involvementItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "15px",
              background: "rgba(199, 199, 199, 0.3)",
              width: "230px",
              height: "30px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => onItemClick && onItemClick(item)}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(199, 199, 199, 0.3)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={item.icon} alt={item.label} style={{ width: "28px" }} />
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#2C2C2C",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
