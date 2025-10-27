import React from "react";
import comment from "../../../../assets/comment.png";
import like from "../../../../assets/like.png";
import view from "../../../../assets/view.png";

export const QuestionCard = ({
  post,
  onClick,
  onLike,
  showPreview = true,
  showViews = false,
}) => {
  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent card onClick from firing
    if (onLike) {
      onLike(post.id);
    }
  };

  return (
    <div
      style={{
        background: "#F1EDED",
        borderRadius: "18px",
        border: "1px solid #DDD3D3",
        padding: "24px",
        width: "100%", // ✅ Flexible width
        maxWidth: "99%", // Prevent overflow
        minHeight: "120px",
        marginBottom: "16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box", // ✅ ensures padding doesn’t overflow
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        }
      }}
    >
      {/* Title/Question */}
      <div
        style={{
          color: "#111827",
          fontSize: "18px",
          fontWeight: "500",
          marginBottom: "8px",
          lineHeight: "1.5",
          textAlign: "left",
          marginTop: "10px",
          marginLeft: "15px",
        }}
      >
        {showPreview && post.question?.length > 120
          ? `${post.question.substring(0, 120)}...`
          : post.question || post.title}
      </div>

      {/* Author + Date */}
      {post.student_name && (
        <div
          style={{
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "12px",
            marginLeft: "15px",
          }}
        >
          by <span style={{ fontWeight: "500" }}>{post.student_name}</span>
          {post.created_at &&
            ` • ${new Date(post.created_at).toLocaleDateString()}`}
        </div>
      )}

      {/* Subject Tag */}
      <div style={{ textAlign: "left" }}>
        <div
          style={{
            display: "inline-block",
            background: "#3B82F6",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: "500",
            padding: "4px 12px",
            borderRadius: "20px",
            marginBottom: "16px",
            marginLeft: "12px",
          }}
        >
          {post.subject || post.category}
        </div>
      </div>

      {/* Engagement Stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "24px",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        {/* Like Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: onLike ? "pointer" : "default",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onClick={handleLikeClick}
          onMouseOver={(e) => {
            if (onLike) e.currentTarget.style.backgroundColor = "#E5E7EB";
          }}
          onMouseOut={(e) => {
            if (onLike) e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <img src={like} alt="likes" style={{ width: "16px" }} />
          <span>{post.likes || 0}</span>
        </div>

        {/* Comment Count */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <img src={comment} alt="comments" style={{ width: "16px" }} />
          <span>{post.comments || post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
};
