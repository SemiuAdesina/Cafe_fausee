import React, { useState, useEffect } from 'react';
import { newsletterService } from '../../services/index.js';
import { showSuccess, showError, formatDate } from '../../services/utils.js';
import Card from '../Card';
import { FiDownload, FiRefreshCw, FiMail, FiUsers } from 'react-icons/fi';
import '../../styles/Admin.css';



const NewsletterManager = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadSignups = async () => {
    try {
      setLoading(true);
      console.log('Loading newsletter signups...');
      
      const data = await newsletterService.getAllSignups();
      console.log('Newsletter signups loaded:', data);
      
      // Ensure signups is always an array
      if (data && data.signups && Array.isArray(data.signups)) {
        setSignups(data.signups);
      } else if (Array.isArray(data)) {
        setSignups(data);
      } else {
        setSignups([]);
      }
      
    } catch (error) {
      console.error('Error loading newsletter signups:', error);
      showError(`Failed to load newsletter signups: ${error.message}`);
      setSignups([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await newsletterService.exportNewsletterCSV();
      showSuccess('Newsletter signups exported successfully!');
    } catch (error) {
      showError('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    loadSignups();
  }, []);

  if (loading) {
    return (
      <div className="admin-manager-container">
        <div className="admin-loading-message">
          <FiRefreshCw className="admin-spin" />
          Loading newsletter signups...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manager-container">
      <div className="admin-manager-header">
        <h2 className="admin-manager-title">Newsletter Management</h2>
        <div className="admin-button-group">
          <button className="admin-btn" onClick={loadSignups}>
            <FiRefreshCw />
            Refresh
          </button>
          <button className="admin-btn" onClick={handleExport} disabled={exporting}>
            <FiDownload />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{signups.length}</div>
          <div className="admin-stat-label">Total Subscribers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">
            {signups.filter(s => s.signup_date).length}
          </div>
          <div className="admin-stat-label">With Signup Date</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">
            {signups.filter(s => !s.signup_date).length}
          </div>
          <div className="admin-stat-label">Without Signup Date</div>
        </div>
      </div>

      <Card>
        {signups.length === 0 ? (
          <div className="admin-empty-message">No newsletter signups found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Signup Date</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((signup) => (
                <tr key={signup.id}>
                  <td>{signup.id}</td>
                  <td>{signup.email}</td>
                  <td>
                    {signup.signup_date ? formatDate(signup.signup_date) : 'Not recorded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default NewsletterManager; 