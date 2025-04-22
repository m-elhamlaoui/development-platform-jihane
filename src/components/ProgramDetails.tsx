import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  backButton: {
    display: 'inline-flex',
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
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px'
  },
  patchesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  patchImage: {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem'
  },
  patchName: {
    textAlign: 'center',
    marginTop: '0.5rem',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  linksContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
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

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using the free API endpoint instead of the rate-limited one
        const response = await fetch(`https://lldev.thespacedevs.com/2.2.0/program/${id}/`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched program details:', data); // Debug log
        setProgram(data);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Failed to fetch program details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgramDetails();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Program not found</p>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
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
        <h1 style={styles.title}>{program.name}</h1>
        <div style={styles.imageContainer}>
          {program.image_url ? (
            <img 
              src={program.image_url} 
              alt={program.name} 
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
            <strong>Start Date:</strong> {new Date(program.start_date).toLocaleDateString()}
          </p>
          {program.end_date && (
            <p style={styles.infoItem}>
              <strong>End Date:</strong> {new Date(program.end_date).toLocaleDateString()}
            </p>
          )}
          <p style={styles.description}>
            {program.description}
          </p>
          {program.mission_patches && program.mission_patches.length > 0 && (
            <div>
              <h2 style={{ color: 'white', marginBottom: '1rem' }}>Mission Patches</h2>
              <div style={styles.patchesContainer}>
                {program.mission_patches.map((patch, index) => (
                  <div key={index}>
                    <img 
                      src={patch.image_url} 
                      alt={patch.name} 
                      style={styles.patchImage}
                    />
                    <p style={styles.patchName}>{patch.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={styles.linksContainer}>
            {program.info_url && (
              <a 
                href={program.info_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
              >
                More Information
              </a>
            )}
            {program.wiki_url && (
              <a 
                href={program.wiki_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
              >
                Wikipedia
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails; 