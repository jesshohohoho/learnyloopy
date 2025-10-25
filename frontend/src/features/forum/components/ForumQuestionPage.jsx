import React from "react";
import like from "../../../assets/like.png";
import LoadingSpinner from "../../../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { useForumQuestion } from "../hooks/useForumQuestion";

// Import reusable components
import { QuestionCard } from "../shared/sharedLayout/QuestionCard";
import { Sidebar } from "../shared/sharedLayout/Sidebar";
import AddQuestion from "../features/components/AddQuestion";

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
    handleCommentLike,
  } = useForumQuestion(id);

  if (loading) {
    return (
      <div
        style={{
          position: "relative",
          marginLeft: "129px",
          width: "calc(100% - 129px)",
          minHeight: "100vh",
          background: "#F3F3F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowX: "hidden",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <LoadingSpinner message="Fetching comments for you..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          marginLeft: "129px",
          width: "calc(100% - 129px)",
          minHeight: "100vh",
          background: "#F3F3F3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#6B7280",
        }}
      >
        Question not found
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#F3F3F3",
        minHeight: "100vh",
        marginLeft: "129px", // keeps space for fixed sidebar
        width: "calc(100% - 129px)",
        boxSizing: "border-box",
        padding: "20px 45px 20px 20px",
        gap: "32px", // space between main content & sidebar
      }}
    >
      {/* ===== Left Column ===== */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Question Card */}
        <QuestionCard
          post={post}
          onClick={null}
          onLike={handleLike}
          showPreview={true}
          showViews={true}
        />

        {/* Comments Section */}
        <div style={{ flex: 1, marginTop: "20px" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
              textAlign: "left",
              paddingLeft: "6px",
              width: "100%",
              alignSelf: "flex-start",
            }}
          >
            Comments:
          </div>

          {/* Comments Container */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "15px",
              border: "1px solid #DDD3D3",
              padding: "24px",
              marginBottom: "16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {comments.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6B7280",
                  padding: "20px",
                  fontSize: "14px",
                }}
              >
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((commentItem, index) => {
                const displayName =
                  commentItem.display_name ||
                  commentItem.student_name ||
                  "Anonymous";
                const commentText =
                  commentItem.comment || commentItem.content || "";

                return (
                  <div
                    key={commentItem.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom:
                        index === comments.length - 1 ? "0" : "20px",
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

                    {/* Comment Body */}
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
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
                            transition: "background-color 0.2s ease",
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
                              objectFit: "contain",
                            }}
                          />
                          <span>{commentItem.likes || 0}</span>
                        </button>
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          color: "#000000",
                          lineHeight: "1.5",
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

          {/* Add Comment */}
          <div style={{ marginTop: "20px", width: "100%" }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              style={{
                width: "100%",
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

      {/* ===== Sidebar ===== */}
      <div
        style={{
          flex: "0 0 300px",
          maxWidth: "300px",
          position: "sticky",
          top: "20px",
          alignSelf: "flex-start",
          height: "fit-content",
          marginRight: "20px",
        }}
      >
        <Sidebar
          trendingTopics={trendingTopics}
          onTopicClick={handleTopicClick}
          onInvolvementClick={handleInvolvementClick}
        />
      </div>
    </div>
  );
}
