import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import studyingAnimation from "../assets/loading.json"; 

const LoadingSpinner = ({ message = "On the way" }) => {
  // --- typing dots effect ---
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // --- floating box ---
  const boxStyle = {
    width: "400px",
    height: "300px",
    background: "linear-gradient(to bottom, #d6f0ff 0%, #eaf8ff 55%, #d9f2e3 80%, #b7e1c3 100%)",

    borderRadius: "20px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    // positioning in the middle of screen
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    fontFamily: "Open Sans, sans-serif", // 🔧 font family
  };

  // --- chatbox style (above cartoon) ---
  const chatboxStyle = {
    top: "25px", // 🔧 position above cartoon
    padding: "12px 20px",
    background: "#ffffffff", // 🔧 chatbox background color
    borderRadius: "20px",
    maxWidth: "80%",
    textAlign: "center",
    color: "#000000ff", // 🔧 text color
    fontSize: "20px", // 🔧 font size
    fontWeight: "700", // 🔧 font weight
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    position: "relative",
  };

  return (
    <div style={boxStyle}>
      {/* Chatbox ABOVE the cartoon */}
      <div style={chatboxStyle}>
        {message}
        {dots}

        {/* small triangle pointer */}
        <div
          style={{
            position: "absolute",
            top: "100%", // 🔧 flip to bottom of chatbox
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid #ffffffff", // 🔧 match chatbox background
          }}
        />
      </div>

      {/* Cartoon animation */}
      <Lottie
        animationData={studyingAnimation}
        loop={true}
        style={{ width: 250, height: 250 }}
      />
    </div>
  );
};

export default LoadingSpinner;
