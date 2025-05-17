import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import rocket from '../components/Assets/Logo.png';

const styles = {
  header: {
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      color: 'white'
    }
  },
  logoImage: {
    width: '32px',
    height: '32px',
    objectFit: 'contain'
  },
  logoText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: '0.05em',
    marginTop: '0.5rem'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    margin: '0 auto'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
      color: '#3498db',
      transform: 'translateY(-2px)'
    }
  },
  activeNavLink: {
    color: '#3498db',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '20px',
      height: '2px',
      background: '#3498db',
      borderRadius: '2px'
    }
  },
  profileButton: {
    background: 'rgba(52, 152, 219, 0.2)',
    color: 'white',
    border: '1px solid rgba(52, 152, 219, 0.4)',
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      background: 'rgba(52, 152, 219, 0.4)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
    }
  },
  profileIcon: {
    width: '20px',
    height: '20px'
  }
} as const;

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        <img
          src={rocket}
          alt="Logo"
          style={styles.logoImage}
        />
        <span style={styles.logoText}>BELONG EARTH</span>
      </Link>
      
      <nav style={styles.nav}>
        <Link 
          to="/homepage" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/homepage' ? styles.activeNavLink : {})
          }}
        >
          Home
        </Link>
        <Link 
          to="/programs" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/programs' ? styles.activeNavLink : {})
          }}
        >
          Programs
        </Link>
        <Link 
          to="/agencies" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/agencies' ? styles.activeNavLink : {})
          }}
        >
          Agencies
        </Link>
        <Link 
          to="/astronauts" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/astronauts' ? styles.activeNavLink : {})
          }}
        >
          Astronauts
        </Link>
      </nav>

      <Link 
        to="/profile"
        style={styles.profileButton}
      >
        <svg 
          style={styles.profileIcon}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Profile
      </Link>
    </header>
  );
};

export default Header; 