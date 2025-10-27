import React from "react";
import { useRecommendation } from "../hooks/useRecommendation";
import resume from '../../../assets/resume.png';
import bulb from '../../../assets/bulb.png';
import LoadingSpinner from "../../../components/Loading";

export default function Recommendation() {
    const { tutors, loading, error, getStarRating, formatDescription } = useRecommendation();
    
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
                                        {getStarRating(tutor.average_rating)} ({tutor.average_rating || 0})
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

                                {/* Bottom Section */}
                                <div style={{ 
                                    textAlign: 'center',
                                    marginTop: 'auto'
                                }}>
                                    <img 
                                        src={resume}
                                        alt="Resume"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            objectFit: 'contain', 
                                            cursor: 'pointer'
                                        }} 
                                    />
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
                                    padding: '24px', 
                                    width: '299px',
                                    height: '180px',
                                    boxShadow: '0 1px 4px #0001', 
                                    textAlign: 'center',
                                    flex: "0 0 auto",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px' // space between bulb and text
                                }}
                            >
                                <img 
                                    src={bulb}
                                    alt="Idea"
                                    style={{ width: '33px', height: '33px', objectFit: 'contain' }}
                                />

                                <div style={{ 
                                    fontSize: '16px', 
                                    color: '#374151', 
                                    fontWeight: "bold", 
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    lineHeight: '1.4'
                                }}>
                                    "{tutor.latest_review || 'Excellent tutor with great teaching skills!'}"
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
