import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import LoadingSpinner from './LoadingSpinner';



interface Agency {
  id: number;
  url: string;
  name: string;
  type: {
    name: string;
  };
  abbrev: string;
  description: string;
  image_url: string | null;
  wiki_url: string | null;
  founding_year: string;
  administrator: string;
  spacecraft: Array<{
    id: number;
    name: string;
  }>;
  launchers: Array<{
    id: number;
    name: string;
  }>;
  total_launch_count: number;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
}

interface DetailedAgency {
  id: number;
  url: string;
  name: string;
  type: {
    name: string;
  };
  abbrev: string;
  description: string;
  image_url: string | null;
  wiki_url: string | null;
  founding_year: string;
  administrator: string;
  spacecraft: Array<{
    id: number;
    name: string;
  }>;
  launchers: Array<{
    id: number;
    name: string;
  }>;
  total_launch_count: number;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
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
  agenciesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  agencyCard: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    padding: '15px',
    color: 'white',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  agencyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#3498db',
    margin: 0,
    height: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  agencyDescription: {
    color: '#ecf0f1',
    fontSize: '1rem',
    lineHeight: '1.5',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    marginBottom: '15px'
  },
  viewDetailsButton: {
    background: 'rgba(52, 152, 219, 0.2)',
    color: 'white',
    border: '1px solid rgba(52, 152, 219, 0.4)',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    marginTop: 'auto',
    '&:hover': {
      background: 'rgba(52, 152, 219, 0.4)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
    }
  },
  agencyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  agencyInfoItem: {
    fontSize: '0.9rem',
    color: '#bdc3c7',
    minHeight: '1.2rem'
  },
  agencyButton: {
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
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    padding: '1rem'
  },
  modal: {
    background: 'rgba(44, 62, 80, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalTitle: {
    fontSize: '2rem',
    margin: 0,
    color: 'white',
    fontWeight: '600',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  modalCloseButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.1)',
      color: '#3498db'
    }
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  modalInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  modalInfoItem: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    '& strong': {
      color: '#3498db',
      marginRight: '0.5rem',
      fontWeight: '600'
    }
  },
  modalLink: {
    color: '#3498db',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    '&:hover': {
      textDecoration: 'underline',
      color: '#2980b9'
    }
  }
} as const;

const Agencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using the free API endpoint instead of the rate-limited one
        const response = await fetch('https://lldev.thespacedevs.com/2.2.0/agencies/?limit=20');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched agencies:', data.results); // Debug log
        
        if (!data.results || data.results.length === 0) {
          setError('No agencies data available. Please try again later.');
          return;
        }
        
        setAgencies(data.results);
      } catch (err) {
        console.error('Error fetching agencies:', err);
        setError('Failed to fetch agencies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
      <h1 style={styles.title}>Space Agencies</h1>
      <div style={styles.agenciesContainer}>
        {agencies.map((agency) => (
          <div key={agency.id} style={styles.agencyCard}>
            <h2 style={styles.agencyTitle}>{agency.name}</h2>
            <p style={styles.agencyDescription}>
              {agency.description || 'No description available'}
            </p>
            <Link 
              to={`/details/${agency.id}`}
              style={styles.viewDetailsButton}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agencies; 