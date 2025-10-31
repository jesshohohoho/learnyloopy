import { useState } from 'react';
import { supabase } from '../lib/supabase'
import illustration from '../assets/loop.png';
import desk from '../assets/login.png';
import { useNavigate } from 'react-router-dom';

export default function CustomAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [message, setMessage] = useState('');

  const handleGuestLogin = () => {
    // Navigate to guided page without authentication
    navigate('/guided');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        // sign up with email, username, password
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: username  
            },
            emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`
          }
        });

        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        // sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        const token = data.session.access_token;
        localStorage.setItem("access_token", token);
        console.log('Token:', token);
        
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Open Sans, sans-serif', flexWrap: 'wrap' }}>

      {/* Left Side Illustration */}
      <div
        style={{
          flex: '1 1 50%',
          minHeight: '400px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'hidden',
          background: `radial-gradient(circle at 20% 30%, #E3E8FF, transparent 70%),
                       radial-gradient(circle at 80% 70%, #FEEAEA, transparent 70%),
                       linear-gradient(135deg, #C5D7FF, #FFE3E3)`,
        }}
      >
        {/* Smooth Lyrics-Style Vertical Scroll */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
          fontSize: '50px',
          fontWeight: '700',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: '1.5',
          fontStyle: "italic",
          overflow: 'hidden',
          height: '50px', // viewport height for scrolling
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            animation: 'scrollLyrics 6s linear infinite'
          }}>
            <span style={{
              background: "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Learn</span>
            <span style={{
              background: "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Loop</span>
            <span style={{
              background: "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Leap</span>
            {/* Repeat first word for smooth infinite loop */}
            <span style={{
              background: "linear-gradient(90deg, #432B99 11.54%, #7048FF 36.54%, #E69696 83.65%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Learn</span>
          </div>
        </div>

        {/* Floating Blobs */}
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(138, 106, 254, 0.3)',
          top: '15%',
          left: '10%',
          filter: 'blur(40px)',
          animation: 'float1 6s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(254, 234, 234, 0.4)',
          bottom: '10%',
          right: '15%',
          filter: 'blur(30px)',
          animation: 'float2 8s ease-in-out infinite alternate',
        }} />

        {/* Desk Illustration */}
        <img
          src={desk}
          alt="Login Illustration"
          style={{
            width: '100%',
            maxWidth: '600px',
            position: 'relative',
            zIndex: 1,
            marginTop: '35%',
          }}
        />

        {/* Keyframes */}
        <style>
          {`
            @keyframes float1 {
              0% { transform: translateY(0px) rotate(0deg); }
              100% { transform: translateY(20px) rotate(20deg); }
            }
            @keyframes float2 {
              0% { transform: translateY(0px) rotate(0deg); }
              100% { transform: translateY(-15px) rotate(-15deg); }
            }
            @keyframes scrollLyrics {
              0% { transform: translateY(0); }
              100% { transform: translateY(-75%); } /* move up smoothly */
            }
            input:focus {
              border-color: #7048FF;
              box-shadow: 0 0 0 3px rgba(112, 72, 255, 0.2);
              outline: none;
            }
          `}
        </style>
      </div>

      {/* Right Side Form */}
      <div
        style={{
          flex: '1 1 50%',
          minHeight: '400px',
          position: 'relative',
          background: '#fff',
          fontSize: '16px',
        }}
      >
        {/* Logo Top-Left */}
        <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', zIndex: 2 }}>
          <img
            src={illustration}
            alt="LearnLoop Logo"
            style={{ width: '40px', marginRight: '12px' }}
          />
          <h1 style={{ color: '#7048FF', fontSize: '25px', fontWeight: 700, margin: 0 }}>
            LearnLoop
          </h1>
        </div>

        {/* Centered Form */}
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '2rem', color: '#333', fontSize: '28px' }}>
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #DDD3D3',
                  borderRadius: '8px',
                  fontSize: '17px',
                  marginBottom: '1rem',
                  transition: '0.3s',
                }}
              />
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Username / Display Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '1px solid #DDD3D3',
                    borderRadius: '8px',
                    fontSize: '17px',
                    marginBottom: '1rem',
                    transition: '0.3s',
                  }}
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #DDD3D3',
                  borderRadius: '8px',
                  fontSize: '17px',
                  marginBottom: '1.5rem',
                  transition: '0.3s',
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  padding: '16px',
                  background: '#8A6AFE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 auto',
                  display: 'block',
                  transition: '0.3s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#7048FF'}
                onMouseOut={e => e.currentTarget.style.background = '#8A6AFE'}
              >
                {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            {message && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '12px',
                  background: message.includes('Check your email') ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${message.includes('Check your email') ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '6px',
                  color: message.includes('Check your email') ? '#155724' : '#721c24',
                  fontSize: '15px',
                }}
              >
                {message}
              </div>
            )}

            {/* Guest Login Button - NEW */}
            <button
              type="button"
              onClick={handleGuestLogin}
              style={{
                width: '100%',
                maxWidth: '350px',
                padding: '12px',
                background: 'transparent',
                color: '#666',
                border: '2px solid #DDD3D3',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                margin: '1rem auto 0 auto',
                display: 'block',
                transition: '0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#DDD3D3';
              }}
            >
              Continue as Guest
            </button>

            <p style={{ marginTop: '1.5rem', fontSize: '16px', color: '#666', textAlign: 'center' }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setUsername('');
                  setMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8A6AFE',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '16px'
                }}
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}