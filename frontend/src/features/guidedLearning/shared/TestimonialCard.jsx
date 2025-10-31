import React from 'react';
import idea from '../../../assets/idea.png';

const TestimonialCard = ({ text, author, icon = idea }) => {
  return (
    <div
      style={{
        background: "#F1EDED",
        border: "1px solid #DDD3D3",
        borderRadius: "12px",
        padding: "20px",
        width: "320px",
        height: "220px",
        textAlign: "center",
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Icon - Fixed at top */}
      <div style={{ 
        flexShrink: 0,
        marginBottom: '12px'
      }}>
        <img
          src={icon}
          alt="Icon"
          style={{ 
            width: "30px", 
            height: "30px",
            display: 'block',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Make text scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: "none",
        }}
      >
        {/* Testimonial Text */}
        <div
          style={{
            fontSize: "16px",
            color: "#000000",
            fontStyle: "italic",
            fontWeight: 600,
            lineHeight: "1.4",
            wordWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          "{text}"
        </div>

        {/* Author Name */}
        {author && (
          <div 
            style={{ 
              fontSize: "15px", 
              color: "#7048FF", 
              fontStyle: "italic",
              marginTop: 'auto'
            }}
          >
            {author}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;