import React from 'react';
import './AgencyDetails.css';

interface Country {
  id: number;
  name: string;
  alpha_2_code: string;
  alpha_3_code: string;
  nationality_name: string;
  nationality_name_composed: string;
}

interface AgencyDetails {
  id: number;
  name: string;
  abbrev: string;
  type: {
    id: number;
    name: string;
  };
  featured: boolean;
  country: Country[];
  description: string;
  administrator: string | null;
  founding_year: number;
  launchers: string;
  spacecraft: string;
  parent: string | null;
  total_launch_count: number;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
  wiki_url: string | null;
}

interface AgencyDetailsProps {
  agency: AgencyDetails;
  onClose: () => void;
}

const AgencyDetails: React.FC<AgencyDetailsProps> = ({ agency, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{agency.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="agency-info-section">
            <h3>Basic Information</h3>
            <p><strong>Abbreviation:</strong> {agency.abbrev}</p>
            <p><strong>Type:</strong> {agency.type.name}</p>
            <p><strong>Founded:</strong> {agency.founding_year}</p>
            {agency.administrator && (
              <p><strong>Administrator:</strong> {agency.administrator}</p>
            )}
          </div>

          <div className="agency-info-section">
            <h3>Location</h3>
            {agency.country.map((country) => (
              <div key={country.id} className="country-info">
                <p><strong>Country:</strong> {country.name}</p>
                <p><strong>Nationality:</strong> {country.nationality_name}</p>
              </div>
            ))}
          </div>

          <div className="agency-info-section">
            <h3>Launch Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{agency.total_launch_count}</span>
                <span className="stat-label">Total Launches</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{agency.successful_launches}</span>
                <span className="stat-label">Successful</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{agency.failed_launches}</span>
                <span className="stat-label">Failed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{agency.pending_launches}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>

          {agency.description && (
            <div className="agency-info-section">
              <h3>Description</h3>
              <p className="description">{agency.description}</p>
            </div>
          )}

          {agency.wiki_url && (
            <div className="agency-info-section">
              <h3>Additional Information</h3>
              <a
                href={agency.wiki_url}
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-link"
              >
                View on Wikipedia
              </a>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AgencyDetails; 