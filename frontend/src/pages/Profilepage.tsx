import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profilepage: React.FC = () => {
  const navigate = useNavigate();
  // Try to get email from localStorage (if you store it there on login/signup)
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/signin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F0320 0%, #0C0417 100%)',
      paddingTop: '80px',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: '320px',
        maxWidth: '90vw',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Profile</h1>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Email:</strong> {email || 'Unknown'}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(90deg, #492871 0%, #113B65 100%)',
            color: 'white',
            border: 'none',
            padding: '0.8rem 2rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(52,152,219,0.1)',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profilepage; 