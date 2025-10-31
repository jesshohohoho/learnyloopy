import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import SmartLearning from "./features/smartLearning/components/SmartLearningPage";
import PastPerformance from "./features/pastPerformance/components/PastPerformancePage";
import GuidedLearning from "./features/guidedLearning/components/GuidedLearningPage";
import Recommendation from "./features/guidedLearning/components/Recommendation";
import Forum from "./features/forum/components/ForumPage";
import ForumQuestion from "./features/forum/components/ForumQuestionPage";
import Sidebar from "./components/Sidebar";
import CustomAuth from "./components/CustomAuth"
import './index.css';
import './App.css';
import { supabase } from "./lib/supabase";
import Leaderboard from "./features/leaderboard/components/LeaderboardPage";
import LoadingSpinner from "./components/Loading";
import AuthCallback from "./components/AuthCallback";

// Layout component for pages with sidebar
function SidebarLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

// Show alert for protected routes before directing to log in page
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const hasShownAlert = useRef(false);

  useEffect(() => {
    // Add a small delay to check if this is part of a logout flow
    const timer = setTimeout(() => {
      if (!hasShownAlert.current) {
        hasShownAlert.current = true;
        alert("You need to log in to access this feature");
        navigate("/auth", { replace: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Return blank page with alert message
  return <div style={{ height: '100vh', background: 'white' }}></div>;
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setLoading(false);
    };

    getSession();

    // set session when auth changes (log in/log out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing session');
        localStorage.removeItem('access_token');
        setSession(null);
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show pages
   return (
    <Router>
      <Routes>
        {/* direct logged in user to home page and not authenticated user to login page*/}
        <Route 
          path="/auth" 
          element={session ? <Navigate to="/performance" replace /> : <CustomAuth />} 
        />

        {/* Auth callback route - handles email confirmation */}
        <Route 
          path="/auth/callback" 
          element={<AuthCallback />} 
        />
        
        {/* Guest route - accessible without authentication */}
        <Route
          path="/loading"
          element={<LoadingSpinner />}
        />

        <Route
          path="/guided"
          element={
            <SidebarLayout>
              <GuidedLearning />
            </SidebarLayout>
          }
        />
        
        <Route
          path="/forum"
          element={
          <SidebarLayout>
              <Forum />
            </SidebarLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <SidebarLayout>
              <Leaderboard />
            </SidebarLayout>
          }
        />

        <Route
          path="/forum/question/:id"
          element={
            <SidebarLayout>
              <ForumQuestion />
            </SidebarLayout>
          }
       />

        {/* Routes require authentication */}
        {session ? (
          <>
            <Route path="/" element={<Navigate to="/performance" replace />} />
            <Route path="/performance" element={<SidebarLayout><PastPerformance /></SidebarLayout>} />
            <Route path="/learn" element={<SidebarLayout><SmartLearning /></SidebarLayout>} />
            <Route path="/recommendation" element={<SidebarLayout><Recommendation /></SidebarLayout>} />
            
            {/* CATCH-ALL for logged-in users */}
            <Route path="*" element={<Navigate to="/performance" replace />} />
          </>
        ) : (  
          <>
            {/* Root path redirects to auth for non-logged-in users */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            
            {/* ✅ Protected routes that show alert for non-logged-in users */}
            <Route path="/performance" element={<ProtectedRoute />} />
            <Route path="/learn" element={<ProtectedRoute />} />
            <Route path="/recommendation" element={<ProtectedRoute />} />
            
            {/* CATCH-ALL for non-logged-in users */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
