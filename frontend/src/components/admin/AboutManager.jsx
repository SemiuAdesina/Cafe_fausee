import React, { useState, useEffect } from 'react';
import { aboutService } from '../../services/index.js';
import { showSuccess, showError } from '../../services/utils.js';
import Card from '../Card';
import { FiEdit, FiTrash2, FiPlus, FiRefreshCw, FiSave, FiX, FiInfo } from 'react-icons/fi';
import '../../styles/Admin.css';

const AboutManager = () => {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    about_text: '',
    mission: '',
    history: '',
    commitment: '',
    founders: []
  });

  const [founderForm, setFounderForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAboutInfo();
      setAboutData(data);
      // Remove console.log for security
      // console.log('About data received:', data); // Debug log
    } catch (error) {
      showError('Failed to load about data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const newItem = await aboutService.createAboutInfo(formData);
      setAboutData([...aboutData, newItem]);
      setShowAddForm(false);
      resetForm();
      showSuccess('About information added successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const updatedItem = await aboutService.updateAboutInfo(editingItem.id, formData);
      setAboutData(aboutData.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      resetForm();
      showSuccess('About information updated successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this about information?')) return;
    
    try {
      await aboutService.deleteAboutInfo(id);
      setAboutData(aboutData.filter(item => item.id !== id));
      showSuccess('About information deleted successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      about_text: item.about_text || '',
      mission: item.mission || '',
      history: item.history || '',
      commitment: item.commitment || '',
      founders: item.founders || []
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      about_text: '',
      mission: '',
      history: '',
      commitment: '',
      founders: []
    });
    setFounderForm({
      name: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFounderInputChange = (e) => {
    setFounderForm({
      ...founderForm,
      [e.target.name]: e.target.value
    });
  };

  const addFounder = () => {
    if (founderForm.name && founderForm.description) {
      setFormData({
        ...formData,
        founders: [...formData.founders, { ...founderForm }]
      });
      setFounderForm({ name: '', description: '' });
    }
  };

  const removeFounder = (index) => {
    setFormData({
      ...formData,
      founders: formData.founders.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="admin-manager-container">
        <div className="admin-loading-message">
          <FiRefreshCw className="admin-spin" />
          Loading about information...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manager-container">
      <div className="admin-manager-header">
        <h2 className="admin-manager-title">About Information Management</h2>
        <div className="admin-button-group">
          <button className="admin-btn" onClick={loadAboutData}>
            <FiRefreshCw />
            Refresh
          </button>
          <button 
            className="admin-btn success" 
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingItem}
          >
            <FiPlus />
            Add Information
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <Card>
          <div className="admin-form-container">
            <h3>{editingItem ? 'Edit About Information' : 'Add New About Information'}</h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="admin-form-group">
                <label>About Text/History:</label>
                <textarea
                  name="about_text"
                  value={formData.about_text}
                  onChange={handleInputChange}
                  className="admin-input"
                  rows="4"
                  placeholder="Enter the main about text or history..."
                />
              </div>

              <div className="admin-form-group">
                <label>Mission:</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  className="admin-input"
                  rows="3"
                  placeholder="Enter the restaurant's mission..."
                />
              </div>

              <div className="admin-form-group">
                <label>History:</label>
                <textarea
                  name="history"
                  value={formData.history}
                  onChange={handleInputChange}
                  className="admin-input"
                  rows="3"
                  placeholder="Enter the restaurant's history..."
                />
              </div>

              <div className="admin-form-group">
                <label>Commitment:</label>
                <textarea
                  name="commitment"
                  value={formData.commitment}
                  onChange={handleInputChange}
                  className="admin-input"
                  rows="3"
                  placeholder="Enter the restaurant's commitment..."
                />
              </div>

              {/* Founders Section */}
              <div className="admin-form-section">
                <h4>Founders</h4>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Founder Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={founderForm.name}
                      onChange={handleFounderInputChange}
                      className="admin-input"
                      placeholder="Enter founder name"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      name="description"
                      value={founderForm.description}
                      onChange={handleFounderInputChange}
                      className="admin-input"
                      placeholder="Enter founder description"
                    />
                  </div>
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={addFounder}
                    disabled={!founderForm.name || !founderForm.description}
                  >
                    <FiPlus />
                    Add Founder
                  </button>
                </div>

                {/* Display Added Founders */}
                {formData.founders.length > 0 && (
                  <div className="admin-founders-list">
                    <h5>Added Founders:</h5>
                    {formData.founders.map((founder, index) => (
                      <div key={`founder-${index}-${founder.name || 'unnamed'}-${founder.description?.substring(0, 10) || 'no-desc'}`} className="admin-founder-item">
                        <span><strong>{founder.name}:</strong> {founder.description}</span>
                        <button
                          type="button"
                          className="admin-action-button danger"
                          onClick={() => removeFounder(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn success">
                  <FiSave />
                  {editingItem ? 'Update' : 'Add'} Information
                </button>
                <button type="button" className="admin-btn" onClick={cancelEdit}>
                  <FiX />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* About Information Table */}
      <Card>
        {!Array.isArray(aboutData) || aboutData.length === 0 ? (
          <div className="admin-empty-message">No about information found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>About Text</th>
                <th>Mission</th>
                <th>History</th>
                <th>Commitment</th>
                <th>Founders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aboutData.map((item, index) => (
                <tr key={item.id || `about-item-${index}`}>
                  <td style={{ maxWidth: '200px' }}>
                    {item.about_text ? item.about_text.substring(0, 100) + '...' : '-'}
                  </td>
                  <td style={{ maxWidth: '150px' }}>
                    {item.mission ? item.mission.substring(0, 80) + '...' : '-'}
                  </td>
                  <td style={{ maxWidth: '150px' }}>
                    {item.history ? item.history.substring(0, 80) + '...' : '-'}
                  </td>
                  <td style={{ maxWidth: '150px' }}>
                    {item.commitment ? item.commitment.substring(0, 80) + '...' : '-'}
                  </td>
                  <td style={{ maxWidth: '120px' }}>
                    {item.founders && item.founders.length > 0 
                      ? `${item.founders.length} founder(s)`
                      : '-'
                    }
                  </td>
                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => startEdit(item)}
                      title="Edit information"
                      disabled={showAddForm || editingItem}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="admin-action-button danger"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete information"
                      disabled={showAddForm || editingItem}
                    >
                      <FiTrash2 />
                    </button>
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

export default AboutManager; 