import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Verifying email...');

        // Get the session after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        console.log('Session after email confirmation:', session);

        if (session) {
          // Store the access token
          localStorage.setItem('access_token', session.access_token);
          console.log('Email confirmed successfully, token stored');
          
          setStatus('Email confirmed! Redirecting...');
          
          // Small delay to show success message
          setTimeout(() => {
            navigate('/performance', { replace: true });
          }, 1000);
        } else {
          // If no session yet, the auth state change listener in App.jsx will handle it
          setStatus('Setting up your account...');
          setTimeout(() => {
            navigate('/performance', { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('Error during auth callback:', err);
        setError(err.message);
        setStatus('Error confirming email');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ color: 'red', fontSize: '1.2rem' }}>❌ {error}</div>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ fontSize: '1.2rem' }}>{status}</div>
      {status.includes('confirmed') && <div style={{ color: 'green', fontSize: '2rem' }}>✓</div>}
    </div>
  );
}