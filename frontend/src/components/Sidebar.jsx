import React from "react";
import "../Sidebar.css";
import Png1 from "../assets/S image 1.png";
import Png2 from "../assets/S image 2.png";
import Png3 from "../assets/S image 3.png";
import Png4 from "../assets/S image 4.png";
import Png5 from "../assets/S image 5.png";
import Png6 from "../assets/S image 6.png";
import Png7 from "../assets/S image 7.png";
import Png8 from "../assets/S image 8.png";
import { supabase } from "../lib/supabase"; // Import supabase
import { useNavigate } from "react-router-dom";

function SidebarButton({ icon, link, onClick, tooltip }) {
  // If onClick is provided, use button instead of anchor
  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="sidebar-button"
        title={tooltip}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          padding: 0, 
          margin: 0,
          cursor: 'pointer'
        }}
      >
        <div className="icon">{icon}</div>
      </button>
    );
  }
  
  return (
    <a href={link} className="sidebar-button" title={tooltip}>
      <div className="icon">{icon}</div>
    </a>
  );
}

function Sidebar() {
  const navigate = useNavigate();

  // clear token in local storage when sign out
  const handleSignOut = async () => {
  try {
    console.log('Starting sign out process...');
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    // Ignore AuthSessionMissingError
  } finally {
    localStorage.removeItem('access_token');
    localStorage.clear();
    navigate('/auth', { replace: true });
    console.log('localStorage cleared and navigation to /auth completed');
  }
};

  // Use the PNGs as <img>
  const DashboardIcon = (
    <img src={Png1} alt="Dashboard" width={48} height={49} />
  );
  const LeaderboardIcon = (
    <img src={Png2} alt="Leaderboard" width={48} height={49} />
  );
  const ForumIcon = (
    <img src={Png3} alt="Forum" width={48} height={49} />
  );
  const ResourcesIcon = (
    <img src={Png4} alt="Resources" width={48} height={49} />
  );
  const GrowthIcon = (
    <img src={Png5} alt="Growth" width={48} height={49} />
  );
  const SmartLearningIcon = (
    <img src={Png6} alt="Smart" width={48} height={49} />
  );
  const GuideLearningIcon = (
    <img src={Png7} alt="Guide" width={48} height={49} />
  );
  const SettingIcon = (
    <img src={Png8} alt="Sign Out" width={48} height={49} />
  );

  return (
    <div className="sidebar">
      <div className="sidebar-logo">LearnLoop</div>

      <div className="sidebar-divider"></div>          {/* first divider */}
      
      <div className="sidebar-buttons">
        <SidebarButton icon={DashboardIcon} link="/performance" tooltip="Past Performance" />
        <SidebarButton icon={LeaderboardIcon} link="/leaderboard" tooltip="Leaderboard" />
        <SidebarButton icon={ForumIcon} link="/forum" tooltip="Forum" />
        <SidebarButton icon={SmartLearningIcon} link="/learn" tooltip="Smart Learning" />
        <SidebarButton icon={GuideLearningIcon} link="/guided" tooltip="Guided Learning" />
      </div>
      
      
      <div className="sidebar-buttons_3">
        {/* Use onClick instead of link for sign out */}
        <SidebarButton icon={SettingIcon} onClick={handleSignOut} tooltip="Sign Out" />
      </div>
    </div>
  );
}

export default Sidebar;