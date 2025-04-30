import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface Astronaut {
  id: number;
  name: string;
  status: {
    name: string;
  };
  agency: {
    name: string;
    abbrev: string;
  };
  image: {
    image_url: string;
  } | null;
  nationality: Array<{
    name: string;
  }>;
  bio: string;
  time_in_space: string;
  flights_count: number;
  spacewalks_count: number;
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
  title: {
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  astronautsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  astronautCard: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(52, 152, 219, 0.4)'
    }
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '300px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '1.2rem',
  },
  content: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'white',
  },
  status: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1rem',
    background: 'rgba(52, 152, 219, 0.2)',
    color: '#3498db',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.95rem',
  },
  infoLabel: {
    color: '#3498db',
    fontWeight: '600',
  },
  bio: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#3498db',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  viewButton: {
    background: 'rgba(52, 152, 219, 0.6)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '1rem',
    '&:hover': {
      background: 'rgba(52, 152, 219, 0.8)',
      transform: 'translateY(-2px)',
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  errorText: {
    color: 'white',
    fontSize: '1.2rem',
    textAlign: 'center',
    margin: '0',
  },
} as const;

const Astronauts: React.FC = () => {
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstronauts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://lldev.thespacedevs.com/2.3.0/astronauts/?format=json');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched astronauts:', data.results);
        
        if (!data.results || data.results.length === 0) {
          setError('No astronauts data available. Please try again later.');
          return;
        }
        
        setAstronauts(data.results);
      } catch (err) {
        console.error('Error fetching astronauts:', err);
        setError('Failed to fetch astronauts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAstronauts();
  }, []);

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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Astronauts</h1>
      <div style={styles.astronautsContainer}>
        {astronauts && astronauts.length > 0 ? (
          astronauts.map((astronaut) => (
            <div
              key={astronaut.id}
              style={styles.astronautCard}
              onClick={() => navigate(`/astronaut/${astronaut.id}`)}
            >
              <div style={styles.imageContainer}>
                {astronaut.image?.image_url ? (
                  <img
                    src={astronaut.image.image_url}
                    alt={astronaut.name}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.placeholderImage}>
                    <span style={styles.placeholderText}>No Image Available</span>
                  </div>
                )}
              </div>
              <div style={styles.content}>
                <h2 style={styles.name}>{astronaut.name}</h2>
                <span style={styles.status}>{astronaut.status.name}</span>
                <div style={styles.info}>
                  <p style={styles.infoItem}>
                    <span style={styles.infoLabel}>Agency:</span>
                    {astronaut.agency.name}
                  </p>
                  <p style={styles.infoItem}>
                    <span style={styles.infoLabel}>Nationality:</span>
                    {astronaut.nationality[0]?.name}
                  </p>
                </div>
                <p style={styles.bio}>
                  {astronaut.bio}
                </p>
                <div style={styles.stats}>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{astronaut.flights_count}</span>
                    <span style={styles.statLabel}>Flights</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{astronaut.spacewalks_count}</span>
                    <span style={styles.statLabel}>Spacewalks</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{astronaut.time_in_space}</span>
                    <span style={styles.statLabel}>Time in Space</span>
                  </div>
                </div>
                <button
                  style={styles.viewButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/astronaut/${astronaut.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>No astronauts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Astronauts; 