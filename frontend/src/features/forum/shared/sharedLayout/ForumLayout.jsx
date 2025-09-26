
import React from "react";

export const ForumLayout = ({ children }) => {
  return (
    <div
      style={{
        maxWidth: "1440px",
        minHeight: "1025px",
        margin: "0 auto",
        background: "#F3F3F3",
        fontFamily: "Open Sans, sans-serif",
        display: "flex",
        gap: "32px",
        padding: "24px",
      }}
    >
      {children}
    </div>
  );
};