import React from "react";
import { RefreshCw, Star } from "lucide-react";
import { useLeaderboard } from '../hooks/useLeaderboard';
import LoadingSpinner from "../../../components/Loading";

const LeaderboardPage = () => {
  const {
    tutors,
    loading,
    refreshing,
    error,
    lastUpdated,
    fetchLeaderboard
  } = useLeaderboard();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} fill="#FFD700" color="#FFD700" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} fill="#FFD700" color="#FFD700" style={{ opacity: 0.5 }} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} color="#E5E7EB" />);
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {stars}
        <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderTeachingStyles = (styles) => {
    if (!styles || styles.length === 0) {
      return <span style={{ color: '#999', fontSize: '12px' }}>No styles</span>;
    }

    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {styles.slice(0, 3).map((style, index) => (
          <span
            key={index}
            style={{
              background: "#EDE4E4",
              padding: "2px 6px",
              borderRadius: "8px",
              fontSize: "10px",
              color: "#555",
              whiteSpace: "nowrap"
            }}
          >
            {style}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1440px",
          height: "1025px",
          margin: "0 auto",
          background: "#F3F3F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Loading leaderboard..." />
      </div>
    );
  }

  if (error && tutors.length === 0) {
    return (
      <div style={{
        position: "relative",
        width: "1440px", // Match page dimensions
        height: "1025px", // Match page dimensions
        background: "#F3F3F3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto"
      }}>
        <div style={{ 
          color: '#ef4444', 
          marginBottom: '16px',
          fontSize: '18px'
        }}>
          Error: {error}
        </div>
        <button 
          onClick={() => fetchLeaderboard()} 
          style={{
            background: '#7048FF',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const topThree = tutors.slice(0, 3);
  const remainingTutors = tutors.slice(3);

  return (
    <div
      style={{
        maxWidth: "1440px",
        height: "1025px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
        background: "#F3F3F3",
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ color: '#333', fontSize: '24px', margin: 0 }}>Tutors Leaderboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdated && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              Updated: {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: refreshing ? '#ccc' : '#7048FF',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {topThree.length > 0 && (
        <div
          style={{
            background: "#F1EDED",
            border: "1px solid #DDD3D3",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {topThree.map((tutor, index) => (
              <div
                key={tutor.rank}
                style={{
                  flex: 1,
                  margin: "0 10px",
                  background: "#c7c7c734",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 4px 0 rgba(46, 19, 79, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <div style={{ fontWeight: "bold", marginBottom: "5px", textAlign: "center" }}>
                  {tutor.name}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: "#7048FF", marginRight: "6px" }}>●</span>
                  <span style={{ color: "#000", fontWeight: "bold" }}>{tutor.credits}</span>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  {renderStars(tutor.avg_rating)}
                </div>

                <div style={{ marginBottom: "6px" }}>
                  {renderTeachingStyles(tutor.teaching_style)}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "24px",
                    height: "24px",
                    borderRadius: "15px",
                    background: "#7048FF",
                    color: "#F1EDED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {tutor.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          background: "#F1EDED",
          border: "1px solid #DDD3D3",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#F1EDED",
          }}
        >
          <thead
            style={{
              background: "#F1EDED",
              textAlign: "left",
              color: "#808080",
              fontWeight: "normal",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            <tr>
              <th style={{ padding: "12px", textAlign: "center" }}>Rank</th>
              <th style={{ padding: "12px" }}>Tutor</th>
              <th style={{ padding: "12px" }}>Credits</th>
              <th style={{ padding: "12px" }}>Style</th>
              <th style={{ padding: "12px" }}>Rating</th>
            </tr>
            <tr>
              <td colSpan="5">
                <div style={{ borderBottom: "1px solid #DDD3D3", width: "100%" }} />
              </td>
            </tr>
          </thead>
          <tbody>
            {remainingTutors.map((tutor) => (
              <tr key={tutor.rank} style={{ borderBottom: "1px solid #DDD3D3" }}>
                <td style={{ padding: "12px", textAlign: "center" }}>{tutor.rank}</td>
                <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>👨‍🏫</span>
                  {tutor.name}
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{ color: "#7048FF", marginRight: "6px" }}>●</span>
                  {tutor.credits}
                </td>
                <td style={{ padding: "12px" }}>
                  {renderTeachingStyles(tutor.teaching_style)}
                </td>
                <td style={{ padding: "12px" }}>
                  {renderStars(tutor.avg_rating)}
                </td>
              </tr>
            ))}
            
            {tutors.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No tutors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;