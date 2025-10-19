// forum/hooks/useForum.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/postsAPI";
import { postAPI } from "../services/postAPI";
import { checkAuthAndPrompt } from "../../../utils/authHelpers";

export const useForum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLike = async (questionId) => {
    if (!(await checkAuthAndPrompt('like posts'))) {
      return;
    }

    try {
      const result = await postAPI.toggleLike(questionId); // Use postAPI for likes
      
      // Update the post's like count in local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === questionId 
            ? { 
                ...post, 
                likes: result.liked 
                  ? (post.likes || 0) + 1 
                  : Math.max((post.likes || 0) - 1, 0)
              }
            : post
        )
      );

      return result;
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Fetch questions with stats
  const fetchQuestionsWithStats = async () => {
    try {
      const questions = await postsAPI.fetchQuestions();

      // Fetch engagement stats for each post
      const postsWithStats = await Promise.all(
        questions.map(async (post) => {
          try {
            const stats = await postsAPI.fetchQuestionStats(post.id);
            return {
              ...post,
              likes: stats.likes || 0,
              comments: stats.comments || 0,
              views: stats.views || 0
            };
          } catch (error) {
            console.error(`Error fetching stats for post ${post.id}:`, error);
            return {
              ...post,
              likes: 0,
              comments: 0,
              views: 0
            };
          }
        })
      );

      setPosts(postsWithStats);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setPosts([]);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const topics = await postsAPI.fetchTrendingTopics();
      setTrendingTopics(topics);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      setTrendingTopics([]);
    }
  };

  // Event handlers
  const handleQuestionAdded = (newQuestion) => {
    setPosts(prevPosts => [newQuestion, ...prevPosts]);
    fetchTrendingTopics(); // Refresh trending topics
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/forum/question/${questionId}`);
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

  const handleShowAddForm = async () => {
    if (await checkAuthAndPrompt('post questions')) {
      setShowAddForm(true);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize data
  useEffect(() => {
    const initializeForum = async () => {
      setLoading(true);
      await Promise.all([
        fetchQuestionsWithStats(),
        fetchTrendingTopics()
      ]);
      setLoading(false);
    };

    initializeForum();
  }, []);

  return {
    // State
    posts,
    trendingTopics,
    loading,
    searchTerm,
    showAddForm,
    filteredPosts,
    
    // Actions
    setSearchTerm,
    setShowAddForm,
    handleShowAddForm,
    handleQuestionAdded,
    handleQuestionClick,
    handleInvolvementClick,
    handleLike,
    
    // Refresh functions
    refreshQuestions: fetchQuestionsWithStats,
    refreshTrendingTopics: fetchTrendingTopics
  };
};