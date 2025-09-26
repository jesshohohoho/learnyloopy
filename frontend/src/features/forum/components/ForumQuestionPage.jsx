import React from "react";
import like from "../../../assets/like.png"
import LoadingSpinner from "../../../components/Loading";

import { useParams, useNavigate } from "react-router-dom";
import { useForumQuestion } from "../hooks/useForumQuestion";

// Import reusable components
import { ForumLayout } from "../shared/sharedLayout/ForumLayout";
import { QuestionCard } from "../shared/sharedLayout/QuestionCard";
import { Sidebar } from "../shared/sharedLayout/Sidebar";

export default function ForumQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    commentText,
    comments,
    post,
    trendingTopics,
    loading,
    setCommentText,
    handleSubmitComment,
    handleTopicClick,
    handleInvolvementClick,
    handleLike,
    handleCommentLike
  } = useForumQuestion(id);

  if (loading) {
    return (
      <div style={{
        position: "relative",
        width: "1440px", // Match page dimensions
        height: "1025px", // Match page dimensions
        background: "#F3F3F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto"
      }}>
        <LoadingSpinner message="Fetching comments for you..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#6B7280"
      }}>
        Question not found
      </div>
    );
  }

  return (
    <ForumLayout>
      {/* Left Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Question Card */}
        <QuestionCard
          post={post}
          onClick={null}
          onLike={handleLike}
          showPreview={true}
          showViews={true}
        />

        {/* Comments Section */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
              textAlign: "left",
              paddingLeft: "6px",
              width: "800px",
              alignSelf: "flex-start"
            }}
          >
            Comment:
          </div>

          {/* Existing Comments */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "15px",
              border: "1px solid #DDD3D3",
              padding: "24px",
              marginBottom: "16px",
              width: "800px"
            }}
          >
            {comments.length === 0 ? (
              <div style={{
                textAlign: "center",
                color: "#6B7280",
                padding: "20px",
                fontSize: "14px"
              }}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((commentItem, index) => {
                // Safe access to display name with fallback
                const displayName = commentItem.display_name || commentItem.student_name || 'Anonymous';
                const commentText = commentItem.comment || commentItem.content || '';
                
                return (
                  <div
                    key={commentItem.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: index === comments.length - 1 ? "0" : "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFF",
                        fontSize: "16px",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, textAlign: "left" }}>
                      {/* Username */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          justifyContent: "space-between"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {displayName}
                        </span>

                        {/* ✅ Add Comment Like Button */}
                        <button
                          onClick={() => handleCommentLike(commentItem.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#6B7280",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#F3F4F6";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          <img 
                            src={like} 
                            alt="like" 
                            style={{
                              width: "16px",
                              height: "16px",
                              objectFit: "contain"
                            }}
                          />
                          <span>{commentItem.likes || 0}</span>
                        </button>


                      </div>

                      {/* Comment text */}
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#000000",
                          lineHeight: "1.5",
                          textAlign: "left",
                        }}
                      >
                        {commentText}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Add Comment Form */}
          <div style={{ marginTop: "20px", width: "800px" }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              style={{
                width: "800px",
                minHeight: "80px",
                padding: "24px",
                border: "1px solid #DDD3D3",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                marginBottom: "12px",
                background: "#FFF",
                textAlign: "left",
              }}
            />
            
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              style={{
                padding: "8px 16px",
                background: commentText.trim() ? "#9CA3AF" : "#D1D5DB",
                border: "none",
                borderRadius: "6px",
                cursor: commentText.trim() ? "pointer" : "not-allowed",
                fontSize: "14px",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        trendingTopics={trendingTopics}
        onTopicClick={handleTopicClick}
        onInvolvementClick={handleInvolvementClick}
      />
    </ForumLayout>
  );
}