import React from "react";
import { checkAuthAndPrompt } from "../shared/utils/authHelpers";
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
    handleLike
  } = useForum();

  if (loading) {
  return (
    <div style={{
      position: "relative",
      width: "1440px", 
      height: "1025px",   
      background: "#F3F3F3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto" 
    }}>
      <LoadingSpinner message="Fetching posts for you..." />
    </div>
  );
}

  return (
    <ForumLayout>
      {/* Left Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleShowAddForm}
          placeholder="Search questions, topics, or authors..."
        />

        {/* Posts Wrapper (scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
            maxHeight: "950px",
          }}
        >
          {filteredPosts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px",
              color: "#6B7280",
              fontSize: "18px"
            }}>
              {searchTerm ? "No posts found matching your search." : "No posts yet. Be the first to ask a question!"}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <QuestionCard
                key={post.id}
                post={post}
                onClick={() => handleQuestionClick(post.id)}
                onLike={handleLike}
                showPreview={true}
                showViews={false}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        trendingTopics={trendingTopics}
        onTopicClick={handleQuestionClick}
        onInvolvementClick={handleInvolvementClick}
      />

      {/* Add Question Popup */}
      <AddQuestion
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onQuestionAdded={handleQuestionAdded}
      />
    </ForumLayout>
  );
}