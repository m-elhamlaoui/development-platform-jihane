import React from 'react';
import './LoadingSpinner.css';

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '2rem',
    background: 'rgba(44, 62, 80, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  loadingSpinner: {
    position: 'relative',
    width: '50px',
    height: '50px',
    marginBottom: '1rem'
  },
  spinnerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '3px solid transparent',
    borderRadius: '50%',
    borderTopColor: '#3498db',
    animation: 'spinner 1s linear infinite'
  },
  loadingText: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '500',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: '0'
  }
} as const;

const LoadingSpinner: React.FC = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}>
        <div style={styles.spinnerRing}></div>
      </div>
      <p style={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner; 