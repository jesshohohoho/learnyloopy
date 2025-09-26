
// components/shared/Sidebar.jsx
import React from "react";
import { TrendingTopics } from "./TrendingTopics";
import { InvolvementSection } from "./InvolvementSection";

export const Sidebar = ({ 
  trendingTopics, 
  onTopicClick, 
  onInvolvementClick 
}) => {
  return (
    <div
      style={{
        width: "331px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <TrendingTopics 
        topics={trendingTopics} 
        onTopicClick={onTopicClick} 
      />
      <InvolvementSection 
        onItemClick={onInvolvementClick} 
      />
    </div>
  );
};