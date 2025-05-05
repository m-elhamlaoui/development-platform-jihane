import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from './LoadingSpinner';

interface Launch {
  id: string;
  name: string;
  net: string;
  status: {
    name: string;
  };
  image: string | null;
  mission: {
    name: string;
    description?: string;
  } | null;
  launch_service_provider: {
    name: string;
  };
  rocket: {
    configuration: {
      name: string;
      full_name: string;
    };
  };
  pad: {
    name: string;
    location: {
      name: string;
    };
  };
}

interface LaunchesGridProps {
  launches: Launch[];
  loading: boolean;
  error: string | null;
}

const LaunchesGrid: React.FC<LaunchesGridProps> = ({ launches, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.launchesContainer}>
      {launches && launches.length > 0 ? (
        launches.map((launch) => (
          <div
            key={launch.id}
            style={styles.launchCard}
            onClick={() => navigate(`/launch/${launch.id}`)}
          >
            <div style={styles.launchImageContainer}>
              {launch.image ? (
                <img
                  src={launch.image}
                  alt={launch.name}
                  style={styles.launchImage}
                />
              ) : (
                <div style={styles.placeholderImage}>
                  <span style={styles.placeholderText}>No Image Available</span>
                </div>
              )}
              {launch.status.name === 'Go' && (
                <div style={styles.liveBadge}>
                  <span style={styles.liveDot}></span>
                  LIVE
                </div>
              )}
            </div>
            <div style={styles.launchContent}>
              <h2 style={styles.launchTitle}>{launch.name}</h2>
              <p style={styles.missionName}>
                {launch.mission?.name || 'No mission name available'}
              </p>
              <div style={styles.launchInfo}>
                <p style={styles.launchInfoItem}>
                  <strong>Launch Date:</strong>{' '}
                  {new Date(launch.net).toLocaleString()}
                </p>
                <p style={styles.launchInfoItem}>
                  <strong>Status:</strong> {launch.status.name}
                </p>
                <p style={styles.launchInfoItem}>
                  <strong>Launch Provider:</strong>{' '}
                  {launch.launch_service_provider.name}
                </p>
              </div>
              <button
                style={styles.launchButton}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/launch/${launch.id}`);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>No launches found</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    paddingTop: '100px',
    background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/src/components/Assets/22.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    position: 'relative',
  },
  title: {
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  tabButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)',
  },
  launchesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  launchCard: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    padding: '15px',
    color: 'white',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  launchImageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '5px'
  },
  launchImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem'
  },
  liveBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(231, 76, 60, 0.8)',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    background: 'white',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite'
  },
  launchContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
  launchTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: 'white',
    height: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  missionName: {
    fontSize: '1rem',
    color: '#bdc3c7',
    marginBottom: '1rem',
    height: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  launchInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  launchInfoItem: {
    fontSize: '0.9rem',
    color: '#bdc3c7',
    minHeight: '1.2rem'
  },
  launchButton: {
    marginTop: 'auto',
    padding: '0.8rem 1.5rem',
    background: 'rgba(52, 152, 219, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    '&:hover': {
      background: 'rgba(52, 152, 219, 0.8)',
      transform: 'translateY(-2px)'
    }
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '2rem',
    background: 'rgba(231, 76, 60, 0.2)',
    borderRadius: '12px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  errorText: {
    color: 'white',
    fontSize: '1.2rem',
    textAlign: 'center',
    margin: '0'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  modalCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    marginBottom: '1rem'
  },
  modalInfo: {
    textAlign: 'center'
  }
} as const;

const Homepage: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous' | 'live'>('upcoming');

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using the free API endpoint instead of the rate-limited one
        let url = 'https://lldev.thespacedevs.com/2.2.0/launch/';
        
        if (activeTab === 'upcoming') {
          url += 'upcoming/?limit=20';
        } else if (activeTab === 'previous') {
          url += 'previous/?limit=20';
        } else if (activeTab === 'live') {
          url += '?format=json&limit=20';
        }
        
        console.log('Fetching from URL:', url); // Debug log
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched launches:', data.results); // Debug log
        
        if (!data.results || data.results.length === 0) {
          setError('No launch data available. Please try again later.');
          return;
        }
        
        setLaunches(data.results);
      } catch (err) {
        console.error('Error fetching launches:', err);
        setError('Failed to fetch launches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [activeTab]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Space Launch Dashboard</h1>
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'upcoming' ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Launches
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'previous' ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab('previous')}
        >
          Past Launches
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'live' ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab('live')}
        >
          Live Launches
        </button>
      </div>
      <LaunchesGrid 
        launches={launches}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Homepage; 