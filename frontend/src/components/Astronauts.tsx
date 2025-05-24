import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface Astronaut {
  id: number;
  name: string;
  status?: {
    name: string;
  };
  agency?: {
    name: string;
    abbrev: string;
  };
  image?: {
    image_url?: string;
  } | null;
  profile_image?: string | null;
  profile_image_thumbnail?: string | null;
  wiki?: string | null;
  bio?: string;
  nationality?: Array<{
    name: string;
  }>;
  date_of_birth?: string;
  twitter?: string;
  instagram?: string;
  flights_count?: number;
  spacewalks_count?: number;
  time_in_space?: string;
  // Added fields based on Space API 2.2.0
  url?: string;
  profile_image_url?: string;
  profile_image_thumbnail_url?: string;
  date_of_death?: string | null;
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

// Helper function to get the astronaut image URL
const getAstronautImageUrl = (astronaut: Astronaut): string | null => {
  // Debug the astronaut object to see all properties
  console.log('Astronaut object:', JSON.stringify(astronaut, null, 2));

  // Try all possible image URL structures
  if (astronaut.profile_image) {
    return astronaut.profile_image;
  } else if (astronaut.profile_image_thumbnail) {
    return astronaut.profile_image_thumbnail;
  } else if ((astronaut as any).profile_image_url) {
    return (astronaut as any).profile_image_url;
  } else if ((astronaut as any).profile_image_thumbnail_url) {
    return (astronaut as any).profile_image_thumbnail_url;
  } else if ((astronaut as any).profile_img) {
    return (astronaut as any).profile_img;
  } else if ((astronaut as any).profile_img_url) {
    return (astronaut as any).profile_img_url;
  } else if ((astronaut as any).thumbnail) {
    return (astronaut as any).thumbnail;
  } else if ((astronaut as any).thumbnail_url) {
    return (astronaut as any).thumbnail_url;
  } else if ((astronaut as any).image_url) {
    return (astronaut as any).image_url;
  } else if (astronaut.image && astronaut.image.image_url) {
    return astronaut.image.image_url;
  }
  return null;
};

// Helper component to display astronaut details
const AstronautCard = ({ astronaut }: { astronaut: Astronaut }) => {
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);

  // Look for image in any of the common locations
  const astronautImage = getAstronautImageUrl(astronaut);

  return (
    <div
      style={styles.astronautCard}
      onClick={() => navigate(`/astronaut/${astronaut.id}`)}
    >
      <div style={styles.imageContainer}>
        {astronautImage ? (
          <img
            src={astronautImage}
            alt={astronaut.name}
            style={styles.image}
            onError={(e) => {
              console.error(`Image failed to load: ${astronautImage}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={styles.placeholderImage}>
            <span style={styles.placeholderText}>No Image Available</span>
          </div>
        )}
      </div>
      <div style={styles.content}>
        <h2 style={styles.name}>{astronaut.name}</h2>
        {astronaut.status && (
          <span style={styles.status}>{astronaut.status.name}</span>
        )}
        <div style={styles.info}>
          {astronaut.agency && (
            <p style={styles.infoItem}>
              <span style={styles.infoLabel}>Agency:</span>
              {astronaut.agency.name}
            </p>
          )}
          {astronaut.nationality && astronaut.nationality[0] && (
            <p style={styles.infoItem}>
              <span style={styles.infoLabel}>Nationality:</span>
              {astronaut.nationality[0]?.name}
            </p>
          )}
        </div>
        <button
          style={{
            background: 'rgba(52, 152, 219, 0.3)',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white',
            marginBottom: '10px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDebug(!showDebug);
          }}
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        
        {showDebug && (
          <div style={{ 
            background: 'rgba(0,0,0,0.7)', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            maxHeight: '200px',
            overflow: 'auto',
            marginBottom: '10px'
          }}>
            <pre style={{ color: '#ddd', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                id: astronaut.id,
                name: astronaut.name,
                image: astronaut.image,
                profile_image: astronaut.profile_image,
                profile_image_thumbnail: astronaut.profile_image_thumbnail,
                // Check other properties
                profileImageUrl: (astronaut as any).profile_image_url,
                imageUrl: (astronaut as any).image_url,
                foundImage: astronautImage
              }, null, 2)}
            </pre>
          </div>
        )}
        
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
  );
};

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
        
        console.log('Fetching astronauts from API...');
        const response = await fetch('http://localhost:8080/api/space/astronauts?limit=20', {
          credentials: 'include'
        });
        
        console.log('Astronauts API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Full astronauts API response structure:', Object.keys(data));
        console.log('Astronauts results array exists:', !!data.results);
        console.log('Astronauts results array length:', data.results?.length);
        
        // If there's no results array, log the full data to see structure
        if (!data.results) {
          console.log('Raw API response data:', JSON.stringify(data, null, 2));
        }
        
        if (!data.results || data.results.length === 0) {
          setError('No astronauts data available. Please try again later.');
          return;
        }
        
        console.log('First astronaut keys:', Object.keys(data.results[0]));
        
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
            <AstronautCard key={astronaut.id} astronaut={astronaut} />
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