import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  backButton: {
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(52, 152, 219, 0.6)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '2rem',
    fontSize: '1rem',
    fontWeight: '600',
    maxWidth: '1200px',
    margin: '0 auto 2rem auto',
    display: 'block',
    '&:hover': {
      background: 'rgba(52, 152, 219, 0.8)',
      transform: 'translateY(-2px)'
    }
  },
  detailsCard: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: 'white',
    fontWeight: '600',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  imageContainer: {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  image: {
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
    fontSize: '1.2rem'
  },
  infoItem: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    '& strong': {
      color: '#3498db',
      marginRight: '0.5rem',
      fontWeight: '600'
    }
  },
  missionDescription: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px'
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
  }
} as const;

const LaunchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaunchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
   
        const response = await fetch(`https://lldev.thespacedevs.com/2.2.0/launch/${id}/`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched launch details:', data); 
        setLaunch(data);
      } catch (err) {
        console.error('Error fetching launch details:', err);
        setError('Failed to fetch launch details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLaunchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
        }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
        }}>
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button 
              style={styles.backButton}
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!launch) {
    return (
      <div style={styles.container}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
        }}>
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Launch not found</p>
            <button 
              style={styles.backButton}
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>
      <div style={styles.detailsCard}>
        <h1 style={styles.title}>{launch.name}</h1>
        <div style={styles.imageContainer}>
          {launch.image ? (
            <img 
              src={launch.image} 
              alt={launch.name} 
              style={styles.image}
            />
          ) : (
            <div style={styles.placeholderImage}>
              <span style={styles.placeholderText}>No Image Available</span>
            </div>
          )}
        </div>
        <div style={styles.content}>
          <p style={styles.infoItem}>
            <strong>Status:</strong> {launch.status.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Launch Time:</strong> {new Date(launch.net).toLocaleString()}
          </p>
          <p style={styles.infoItem}>
            <strong>Launch Provider:</strong> {launch.launch_service_provider.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Rocket:</strong> {launch.rocket.configuration.full_name}
          </p>
          <p style={styles.infoItem}>
            <strong>Launch Pad:</strong> {launch.pad.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Location:</strong> {launch.pad.location.name}
          </p>
          {launch.mission && (
            <>
              <p style={styles.infoItem}>
                <strong>Mission:</strong> {launch.mission.name}
              </p>
              {launch.mission.description && (
                <p style={styles.missionDescription}>
                  {launch.mission.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchDetails; 