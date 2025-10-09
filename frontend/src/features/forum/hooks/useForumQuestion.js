// forum/hooks/useForumQuestion.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../services/postAPI";
import { checkAuthAndPrompt } from "../shared/utils/authHelpers";

export const useForumQuestion = (questionId) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLike = async (targetQuestionId = questionId) => {
    if (!(await checkAuthAndPrompt('like posts'))) {
      return;
    }

    try {
      const result = await postAPI.toggleLike(targetQuestionId);
      
      // Update the current post's likes 
      if (targetQuestionId == questionId) {
        setPost(prevPost => ({
          ...prevPost,
          likes: result.liked 
            ? (prevPost.likes || 0) + 1 
            : Math.max((prevPost.likes || 0) - 1, 0)
        }));
      }

      return result;
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!(await checkAuthAndPrompt('like comments'))) {
      return;
    }

    try {
      const result = await postAPI.toggleCommentLike(commentId);
      
      // Update the specific comment's likes in the comments array
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: result.total_likes }
            : comment
        )
      );

      return result;
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  // Fetch question details
  const fetchQuestionDetails = async () => {
    if (!questionId) return;

    try {
      setLoading(true);
      const questionData = await postAPI.fetchQuestionDetails(questionId);
      
      // The questionData already includes comments from backend
      setPost(questionData);
      setComments(questionData.forum_comments || []);
      
      // Fetch stats separately if needed
      try {
        const stats = await postAPI.fetchQuestionStats(questionId);
        setPost(prev => ({ ...prev, ...stats }));
      } catch (statsError) {
        console.warn("Could not fetch stats, continuing without them");
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const topics = await postAPI.fetchTrendingTopics();
      setTrendingTopics(topics);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      setTrendingTopics([]);
    }
  };

  // Submit comment
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    if (!(await checkAuthAndPrompt('comment'))) {
      return;
    }

    try {
      const commentData = {
        student_id: "current_user_id", 
        student_name: "Your Comment",   
        comment: commentText
      };

      const newComment = await postAPI.addComment(questionId, commentData);
      setComments(prevComments => [...prevComments, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      // You might want to show an error message to the user here
    }
  };

  // Navigation handlers
  const handleTopicClick = (topicId) => {
    navigate(`/forum/question/${topicId}`);
  };

  const handleInvolvementClick = (item) => {
    switch(item.label) {
      case "My Question":
        navigate("/forum/my-questions");
        break;
      case "My Participation":
        navigate("/forum/my-participation");
        break;
      case "Solved":
        console.log("Show solved questions");
        break;
      case "Unsolved":
        console.log("Show unsolved questions");
        break;
      default:
        break;
    }
  };

  // Initialize data when questionId changes
  useEffect(() => {
    fetchQuestionDetails();
    fetchTrendingTopics();
  }, [questionId]);

  return {
    // State
    commentText,
    comments,
    post,
    trendingTopics,
    loading,
    
    // Actions
    setCommentText,
    handleSubmitComment,
    handleTopicClick,
    handleInvolvementClick,
    handleLike,
    handleCommentLike,
    
    // Refresh functions
    refreshQuestion: fetchQuestionDetails,
    refreshTrendingTopics: fetchTrendingTopics
  };
};