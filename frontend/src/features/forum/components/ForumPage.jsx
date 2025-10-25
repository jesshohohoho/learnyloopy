import React from "react";
import { useForum } from "../hooks/useForum";
import AddQuestion from "../features/components/AddQuestion";
import LoadingSpinner from "../../../components/Loading";

// Import reusable components for ForumPage and ForumQuestion
import { ForumLayout } from "../shared/sharedLayout/ForumLayout";
import { SearchBar } from "../shared/sharedLayout/SearchBar";
import { QuestionCard } from "../shared/sharedLayout/QuestionCard";
import { Sidebar } from "../shared/sharedLayout/Sidebar";

export default function ForumPage() {
  const {
    trendingTopics,
    loading,
    searchTerm,
    showAddForm,
    filteredPosts,
    setSearchTerm,
    setShowAddForm,
    handleShowAddForm,
    handleQuestionAdded,
    handleQuestionClick,
    handleInvolvementClick,
    handleLike,
  } = useForum();

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
        <LoadingSpinner message="Fetching posts for you..." />
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
        padding: "20px 45px 20px 20px", // right padding for breathing space
        gap: "32px", // space between main content & sidebar
      }}
    >
      {/* ===== Left Column (Main Content) ===== */}
      <div
        style={{
          flex: "1 1 auto", // ⬅️ fully flexible, grows with screen
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // prevents overflow issues in flexbox
        }}
      >
        {/* Search bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleShowAddForm}
          placeholder="Search questions, topics, or authors..."
        />

        {/* Posts list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginTop: "20px",
            width: "100%", // ⬅️ ensures same width as SearchBar
            maxHeight: "950px",
            boxSizing: "border-box",
          }}
        >
          {filteredPosts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                color: "#6B7280",
                fontSize: "18px",
              }}
            >
              {searchTerm
                ? "No posts found matching your search."
                : "No posts yet. Be the first to ask a question!"}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  width: "100%", // ⬅️ post card expands same width as search bar
                  marginBottom: "20px",
                }}
              >
                <QuestionCard
                  post={post}
                  onClick={() => handleQuestionClick(post.id)}
                  onLike={handleLike}
                  showPreview={true}
                  showViews={false}
                />
              </div>
            ))
          )}
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
          marginRight: "20px", // adds space from right edge
        }}
      >
        <Sidebar
          trendingTopics={trendingTopics}
          onTopicClick={handleQuestionClick}
          onInvolvementClick={handleInvolvementClick}
        />
      </div>

      {/* ===== Add Question Modal ===== */}
      <AddQuestion
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onQuestionAdded={handleQuestionAdded}
      />
    </div>
  );
}
