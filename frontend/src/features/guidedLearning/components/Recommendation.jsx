import React, { useState } from "react";
import { useRecommendation } from "../hooks/useRecommendation";
import resume from '../../../assets/resume.png';
import bulb from '../../../assets/bulb.png';
import LoadingSpinner from "../../../components/Loading";

export default function Recommendation() {
    const { tutors, loading, error, getStarRating, formatDescription } = useRecommendation();
    const [showPopup, setShowPopup] = useState(false);
    if (loading) {
        return (
            <div style={{
                position: "relative",
                marginLeft: "130px",             
                width: "calc(100% - 129px)",
                minHeight: "100vh", 
                background: "#F3F3F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                padding: "20px", 
                boxSizing: "border-box" 
            }}>
                <LoadingSpinner message="Finding suitable tutors for you" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                background: '#F3F3F3', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column' 
            }}>
                <div style={{ fontSize: '18px', color: '#d32f2f', marginBottom: '16px' }}>{error}</div>
                <button 
                    onClick={() => window.history.back()} 
                    style={{
                        background: '#6F48FF',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div 
            className="recommendation-container" 
            style={{ 
                marginLeft: "150px",             
                width: "calc(100% - 150px)",      
                minHeight: "100vh",
                background: "#F3F3F3",
                padding: "20px",
                boxSizing: "border-box",
                overflowX: "hidden",
                overflowY: "auto",
            }}
        >

            {/* Popup message for developing feature */}
            {showPopup && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#F3F3F3",
                            borderRadius: "18px",
                            padding: "40px",
                            maxWidth: "400px",
                            textAlign: "center",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                            position: "relative"
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                fontSize: "28px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#888"
                            }}
                        >
                            ×
                        </button>

                        {/* Icon */}
                        <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                            🚧
                        </div>

                        {/* Message */}
                        <div style={{
                            fontFamily: "Open Sans, sans-serif",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#222",
                            marginBottom: "24px"
                        }}>
                            This feature will be available soon.
                        </div>

                        {/* OK Button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                padding: "12px 32px",
                                background: "#6F48FF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "15px",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                boxShadow: "2px 2px 6px #DDD3D3"
                            }}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: "32px 100px 60px 32px", 
                boxSizing: "border-box"
            }}>
                
                {/* Title */}
                <div style={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '25px', 
                    marginBottom: '24px' 
                }}>
                    <span style={{ 
                        background: 'linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        Your Next Tutor is Just a Click Away!
                    </span>
                </div>

                {/* Tutor Cards */}
                <div style={{ marginBottom: "12px" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "18px",
                            overflowX: "auto",
                            paddingBottom: "16px",
                            paddingRight: "50px",
                            scrollbarWidth: "none",
                            alignItems: "flex-start",
                        }}
                        className="hide-scrollbar" 
                    >
                        {tutors.map((tutor, index) => (
                            <div 
                                key={tutor.id || index} 
                                style={{ 
                                    background: '#F1EDED', 
                                    border: '1px solid #C7C7C7', 
                                    borderRadius: '16px', 
                                    padding: '24px', 
                                    height: '596px', 
                                    width: '299px',
                                    textAlign: 'center',
                                    flex: "0 0 auto",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {/* Top Section */}
                                <div>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        fontSize: '22.5px', 
                                        marginTop: '10px', 
                                        marginBottom: '18px' 
                                    }}>
                                        {tutor.name || `Tutor ${index + 1}`}
                                    </div>

                                    <div style={{ 
                                        width: '120px', 
                                        height: '120px', 
                                        borderRadius: '50%', 
                                        background: '#F9A8D4', 
                                        margin: '0 auto 18px auto', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: '64px',
                                        lineHeight: '1',
                                        fontFamily: 'system-ui, -apple-system, sans-serif'
                                    }}>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                            👩‍🏫
                                        </span>
                                    </div>
                                    
                                    <div style={{ 
                                        color: '#6366F1', 
                                        fontSize: '25px', 
                                        marginBottom: '18px' 
                                    }}>
                                        {getStarRating(tutor.avg_rating)} ({tutor.avg_rating || 0})
                                    </div>

                                    <div style={{ 
                                        color: '#000000',
                                        fontFamily: '"Open Sans", sans-serif',
                                        fontSize: '18px',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        lineHeight: '25px',
                                        marginBottom: '20px',
                                        marginTop: '25px'
                                    }}>
                                        {formatDescription(tutor)}
                                    </div>
                                </div>

                                {/* Contact Button */}
                                <div style={{ 
                                    textAlign: 'center',
                                    marginTop: 'auto'
                                }}>
                                    <button
                                        onClick={() => setShowPopup(true)}
                                        style={{
                                            padding: "10px 24px",
                                            background: "#6F48FF",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                                            transition: "all 0.2s ease",
                                            fontFamily: "Open Sans, sans-serif"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.05)";
                                            e.currentTarget.style.background = "#5a38cc";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.background = "#6F48FF";
                                        }}
                                    >
                                        Contact Tutor
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Cards */}
                <div style={{ marginBottom: "40px" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "18px",
                            overflowX: "auto",
                            paddingBottom: "16px",
                            paddingRight: "50px",
                            scrollbarWidth: "none",
                        }}
                        className="hide-scrollbar"
                    >
                        {tutors.map((tutor, index) => (
                            <div 
                                key={`review-${tutor.id || index}`} 
                                style={{ 
                                    background: '#F1EDED', 
                                    border: '1px solid #C7C7C7', 
                                    borderRadius: '12px', 
                                    padding: '20px', 
                                    width: '299px',
                                    height: '180px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)', 
                                    flex: "0 0 auto",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* Lightbulb Icon - Fixed at top */}
                                <div style={{ 
                                    flexShrink: 0,
                                    marginBottom: '12px'
                                }}>
                                    <img 
                                        src={bulb}
                                        alt="Idea"
                                        style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            objectFit: 'contain',
                                            display: 'block'
                                        }}
                                    />
                                </div>

                                {/* Review Text - Scrollable */}
                                <div style={{ 
                                    flex: 1,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    width: '100%',
                                    paddingRight: '8px',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: "none",
                                }}>
                                    <div style={{ 
                                        fontSize: '15px', 
                                        color: '#374151', 
                                        fontWeight: 600, 
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        lineHeight: '1.5',
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        hyphens: 'auto',
                                        fontFamily: '"Open Sans", sans-serif'
                                    }}>
                                        "{tutor.latest_review || 'Excellent tutor with great teaching skills!'}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                

            </main>
        </div>
    );
}
