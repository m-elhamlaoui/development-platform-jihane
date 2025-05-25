import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  nationality?: Array<{
    name: string;
  }>;
  bio?: string;
  time_in_space?: string;
  eva_time?: string;
  age?: number;
  date_of_birth?: string;
  date_of_death?: string | null;
  wiki?: string | null;
  last_flight?: string;
  first_flight?: string;
  social_media_links?: Array<{
    url: string;
    social_media: {
      name: string;
    };
  }>;
  flights_count?: number;
  landings_count?: number;
  spacewalks_count?: number;
  // Added fields based on Space API 2.2.0
  url?: string;
  profile_image_url?: string;
  profile_image_thumbnail_url?: string;
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
  bio: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px'
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  socialLink: {
    color: '#3498db',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    '&:hover': {
      textDecoration: 'underline',
      color: '#2980b9'
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

const AstronautDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [astronaut, setAstronaut] = useState<Astronaut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstronautDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching astronaut details for ID:', id);
        const response = await fetch(`/api/space/astronauts/${id}`, {
          credentials: 'include'
        });
        
        console.log('Astronaut details API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Full astronaut details response structure:', Object.keys(data));
        
        // For detailed debugging
        console.log('Raw astronaut details data:', JSON.stringify(data, null, 2));
        
        setAstronaut(data);
      } catch (err) {
        console.error('Error fetching astronaut details:', err);
        setError('Failed to fetch astronaut details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAstronautDetails();
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

  if (!astronaut) {
    return (
      <div style={styles.container}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
        }}>
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Astronaut not found</p>
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

  // Helper function to get the astronaut image URL
  const getAstronautImageUrl = (astronaut: Astronaut | null): string | null => {
    if (!astronaut) return null;
    
    // Debug the astronaut object to see all properties
    console.log('Astronaut details object:', JSON.stringify(astronaut, null, 2));
    
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

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>
      <div style={styles.detailsCard}>
        <h1 style={styles.title}>{astronaut.name}</h1>
        <div style={styles.imageContainer}>
          {getAstronautImageUrl(astronaut) ? (
            <img 
              src={getAstronautImageUrl(astronaut) || ''} 
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
          <p style={styles.infoItem}>
            <strong>Status:</strong> {astronaut.status?.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Agency:</strong> {astronaut.agency?.name} ({astronaut.agency?.abbrev})
          </p>
          <p style={styles.infoItem}>
            <strong>Nationality:</strong> {astronaut.nationality?.[0]?.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Age:</strong> {astronaut.age}
          </p>
          <p style={styles.infoItem}>
            <strong>Date of Birth:</strong> {new Date(astronaut.date_of_birth || '').toLocaleDateString()}
          </p>
          {astronaut.date_of_death && (
            <p style={styles.infoItem}>
              <strong>Date of Death:</strong> {new Date(astronaut.date_of_death).toLocaleDateString()}
            </p>
          )}
          <p style={styles.infoItem}>
            <strong>Time in Space:</strong> {astronaut.time_in_space}
          </p>
          <p style={styles.infoItem}>
            <strong>EVA Time:</strong> {astronaut.eva_time}
          </p>
          <p style={styles.infoItem}>
            <strong>Flights:</strong> {astronaut.flights_count}
          </p>
          <p style={styles.infoItem}>
            <strong>Landings:</strong> {astronaut.landings_count}
          </p>
          <p style={styles.infoItem}>
            <strong>Spacewalks:</strong> {astronaut.spacewalks_count}
          </p>
          <p style={styles.infoItem}>
            <strong>First Flight:</strong> {new Date(astronaut.first_flight || '').toLocaleDateString()}
          </p>
          <p style={styles.infoItem}>
            <strong>Last Flight:</strong> {new Date(astronaut.last_flight || '').toLocaleDateString()}
          </p>
          <p style={styles.bio}>
            {astronaut.bio}
          </p>
          <div style={styles.socialLinks}>
            {astronaut.wiki && (
              <a 
                href={astronaut.wiki} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                Wikipedia
              </a>
            )}
            {astronaut.social_media_links?.map((link, index) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                {link.social_media.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstronautDetails; 