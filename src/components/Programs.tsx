import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface Program {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  info_url: string | null;
  wiki_url: string | null;
  mission_patches: Array<{
    name: string;
    image_url: string;
  }>;
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
  programsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  programCard: {
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
  programImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '5px'
  },
  programContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
  programTitle: {
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
  programDescription: {
    fontSize: '1rem',
    color: '#bdc3c7',
    marginBottom: '1rem',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical'
  },
  programInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  programInfoItem: {
    fontSize: '0.9rem',
    color: '#bdc3c7',
    minHeight: '1.2rem'
  },
  programButton: {
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
  }
} as const;

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using the free API endpoint instead of the rate-limited one
        const response = await fetch('https://lldev.thespacedevs.com/2.2.0/program/?limit=20');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched programs:', data.results); // Debug log
        
        if (!data.results || data.results.length === 0) {
          setError('No programs data available. Please try again later.');
          return;
        }
        
        setPrograms(data.results);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to fetch programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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
    <div style={styles.container}>
      <h1 style={styles.title}>Space Programs</h1>
      <div style={styles.programsContainer}>
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <div
              key={program.id}
              style={styles.programCard}
              onClick={() => navigate(`/program/${program.id}`)}
            >
              {program.image_url ? (
                <img
                  src={program.image_url}
                  alt={program.name}
                  style={styles.programImage}
                />
              ) : (
                <div style={styles.programImage} />
              )}
              <div style={styles.programContent}>
                <h2 style={styles.programTitle}>{program.name}</h2>
                <p style={styles.programDescription}>
                  {program.description}
                </p>
                <div style={styles.programInfo}>
                  <p style={styles.programInfoItem}>
                    <strong>Start Date:</strong> {new Date(program.start_date).toLocaleDateString()}
                  </p>
                  {program.end_date && (
                    <p style={styles.programInfoItem}>
                      <strong>End Date:</strong> {new Date(program.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  style={styles.programButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/program/${program.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>No programs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs; 