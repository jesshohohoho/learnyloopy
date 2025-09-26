// components/shared/SearchBar.jsx
import React from "react";
import search from "../../../../assets/search.png";
import add from "../../../../assets/add.png";

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onAddClick, 
  placeholder = "Search questions, topics, or authors..." 
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
        gap: "12px",
      }}
    >
      {/* Search Input */}
      <div
        style={{
          flex: 1,
          height: "42px",
          background: "#FFF",
          borderRadius: "30px",
          border: "1px solid #DDD3D3",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={search}
          alt="search"
          style={{ width: "20px", marginRight: "12px" }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "18px",
            color: "#374151",
            background: "transparent",
          }}
        />
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "transform 0.2s"
        }}
        onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        <img src={add} alt="Add Question" style={{ width: "40px", height: "40px" }} />
      </button>
    </div>
  );
};
