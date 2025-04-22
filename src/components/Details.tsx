import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    color: 'white'
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
    background: 'rgba(44, 62, 80, 0.95)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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
  link: {
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

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://ll.thespacedevs.com/2.2.0/agencies/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch agency details');
        }
        const data = await response.json();
        setAgency(data);
      } catch (err) {
        setError('Failed to fetch agency details. Please try again later.');
        console.error('Error fetching agency details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgencyDetails();
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

  if (!agency) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Agency not found</p>
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
        <h1 style={styles.title}>{agency.name}</h1>
        <div style={styles.content}>
          <p style={styles.infoItem}>
            <strong>Description:</strong> {agency.description || 'No description available'}
          </p>
          <p style={styles.infoItem}>
            <strong>Type:</strong> {agency.type.name}
          </p>
          <p style={styles.infoItem}>
            <strong>Abbreviation:</strong> {agency.abbrev}
          </p>
          <p style={styles.infoItem}>
            <strong>Founded:</strong> {agency.founding_year}
          </p>
          <p style={styles.infoItem}>
            <strong>Administrator:</strong> {agency.administrator}
          </p>
          <p style={styles.infoItem}>
            <strong>Total Launches:</strong> {agency.total_launch_count}
          </p>
          <p style={styles.infoItem}>
            <strong>Successful Launches:</strong> {agency.successful_launches}
          </p>
          <p style={styles.infoItem}>
            <strong>Failed Launches:</strong> {agency.failed_launches}
          </p>
          <p style={styles.infoItem}>
            <strong>Pending Launches:</strong> {agency.pending_launches}
          </p>
          {agency.spacecraft && Array.isArray(agency.spacecraft) && agency.spacecraft.length > 0 && (
            <p style={styles.infoItem}>
              <strong>Spacecraft:</strong> {agency.spacecraft.map(spacecraft => spacecraft.name).join(', ')}
            </p>
          )}
          {agency.launchers && Array.isArray(agency.launchers) && agency.launchers.length > 0 && (
            <p style={styles.infoItem}>
              <strong>Launchers:</strong> {agency.launchers.map(launcher => launcher.name).join(', ')}
            </p>
          )}
          {agency.wiki_url && (
            <p style={styles.infoItem}>
              <strong>Wiki:</strong>{' '}
              <a 
                href={agency.wiki_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
              >
                Learn More
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details; 