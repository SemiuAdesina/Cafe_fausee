import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/index.js';
import { showSuccess, showError } from '../../services/utils.js';
import Card from '../Card';
import SearchFilter from '../SearchFilter';
import Pagination from '../Pagination';
import ImageUpload from '../ImageUpload';
import { FiEdit, FiTrash2, FiPlus, FiRefreshCw, FiSave, FiX, FiImage, FiAward, FiMessageSquare } from 'react-icons/fi';
import '../../styles/Admin.css';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [awards, setAwards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('images');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    year: '',
    content: '',
    author: '',
    source: ''
  });

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadGalleryData();
  }, []);

  // Filter and search logic
  const getFilteredItems = () => {
    let items = [];
    switch (activeTab) {
      case 'images':
        items = images;
        break;
      case 'awards':
        items = awards;
        break;
      case 'reviews':
        items = reviews;
        break;
      default:
        items = [];
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => {
        if (activeTab === 'images') {
          return item.title?.toLowerCase().includes(term) ||
                 item.description?.toLowerCase().includes(term);
        } else if (activeTab === 'awards') {
          return item.title?.toLowerCase().includes(term) ||
                 item.description?.toLowerCase().includes(term) ||
                 item.year?.toString().includes(term);
        } else if (activeTab === 'reviews') {
          return item.content?.toLowerCase().includes(term) ||
                 item.author?.toLowerCase().includes(term) ||
                 item.source?.toLowerCase().includes(term);
        }
        return false;
      });
    }

    // Apply filters
    if (filters.year && activeTab === 'awards') {
      items = items.filter(item => item.year === filters.year);
    }

    return items;
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      console.log('Loading gallery data...');
      
      const [imagesData, awardsData, reviewsData] = await Promise.all([
        galleryService.getAllImages(),
        galleryService.getAllAwards(),
        galleryService.getAllReviews()
      ]);
      
      console.log('Gallery data loaded:', { imagesData, awardsData, reviewsData });
      
      // Ensure all data are arrays
      setImages(Array.isArray(imagesData) ? imagesData : []);
      setAwards(Array.isArray(awardsData) ? awardsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      
    } catch (err) {
      console.error('Error loading gallery data:', err);
      showError(`Failed to load gallery data: ${err.message}`);
      // Set empty arrays on error to prevent further issues
      setImages([]);
      setAwards([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      let newItem;
      switch (activeTab) {
        case 'images':
          newItem = await galleryService.createImage(formData);
          setImages([...images, newItem]);
          break;
        case 'awards':
          newItem = await galleryService.createAward({
            title: formData.title,
            year: formData.year,
            description: formData.description
          });
          setAwards([...awards, newItem]);
          break;
        case 'reviews':
          newItem = await galleryService.createReview({
            content: formData.content,
            author: formData.author,
            source: formData.source
          });
          setReviews([...reviews, newItem]);
          break;
      }
      setShowAddForm(false);
      resetForm();
      showSuccess(`${activeTab.slice(0, -1)} added successfully`);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      let updatedItem;
      switch (activeTab) {
        case 'images':
          updatedItem = await galleryService.updateImage(editingItem.id, formData);
          setImages(images.map(item => item.id === editingItem.id ? updatedItem : item));
          break;
        case 'awards':
          updatedItem = await galleryService.updateAward(editingItem.id, {
            title: formData.title,
            year: formData.year,
            description: formData.description
          });
          setAwards(awards.map(item => item.id === editingItem.id ? updatedItem : item));
          break;
        case 'reviews':
          updatedItem = await galleryService.updateReview(editingItem.id, {
            content: formData.content,
            author: formData.author,
            source: formData.source
          });
          setReviews(reviews.map(item => item.id === editingItem.id ? updatedItem : item));
          break;
      }
      setEditingItem(null);
      resetForm();
      showSuccess(`${activeTab.slice(0, -1)} updated successfully`);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (activeTab) {
        case 'images':
          await galleryService.deleteImage(id);
          setImages(images.filter(item => item.id !== id));
          break;
        case 'awards':
          await galleryService.deleteAward(id);
          setAwards(awards.filter(item => item.id !== id));
          break;
        case 'reviews':
          await galleryService.deleteReview(id);
          setReviews(reviews.filter(item => item.id !== id));
          break;
      }
      showSuccess(`${activeTab.slice(0, -1)} deleted successfully`);
    } catch (err) {
      showError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
      year: item.year || '',
      content: item.content || '',
      author: item.author || '',
      source: item.source || ''
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      year: '',
      content: '',
      author: '',
      source: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Search and filter handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Image upload handlers
  const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      image_url: imageUrl
    });
  };

  const handleImageRemove = () => {
    setFormData({
      ...formData,
      image_url: ''
    });
  };

  const renderForm = () => {
    const isEditing = !!editingItem;
    const title = isEditing ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`;

    return (
      <Card>
        <div className="admin-form-container">
          <h3>{title}</h3>
          <form onSubmit={isEditing ? handleUpdateItem : handleAddItem}>
            {activeTab === 'images' && (
              <>
                <div className="admin-form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-input"
                    rows="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Image Upload:</label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    onRemove={handleImageRemove}
                    currentImage={formData.image_url}
                    maxSize={5}
                  />
                </div>
              </>
            )}

            {activeTab === 'awards' && (
              <>
                <div className="admin-form-group">
                  <label>Award Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Year:</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="admin-input"
                    min="1900"
                    max="2030"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-input"
                    rows="3"
                  />
                </div>
              </>
            )}

            {activeTab === 'reviews' && (
              <>
                <div className="admin-form-group">
                  <label>Review Content:</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    rows="4"
                    placeholder="Enter the review content..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Author:</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Source (optional):</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="admin-input"
                    placeholder="e.g., Gourmet Review, The Daily Bite"
                  />
                </div>
              </>
            )}

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn success">
                <FiSave />
                {isEditing ? 'Update' : 'Add'} {activeTab.slice(0, -1)}
              </button>
              <button type="button" className="admin-btn" onClick={cancelEdit}>
                <FiX />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Card>
    );
  };

  const renderTable = () => {
    const items = currentItems;

    if (items.length === 0) {
      return <div className="admin-empty-message">No {activeTab} found.</div>;
    }

    if (activeTab === 'images') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="admin-action-button"
                    onClick={() => startEdit(item)}
                    title="Edit image"
                    disabled={showAddForm || editingItem}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="admin-action-button danger"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete image"
                    disabled={showAddForm || editingItem}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'awards') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.year}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="admin-action-button"
                    onClick={() => startEdit(item)}
                    title="Edit award"
                    disabled={showAddForm || editingItem}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="admin-action-button danger"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete award"
                    disabled={showAddForm || editingItem}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'reviews') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Author</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ maxWidth: '300px' }}>{item.content}</td>
                <td>{item.author}</td>
                <td>{item.source}</td>
                <td>
                  <button
                    className="admin-action-button"
                    onClick={() => startEdit(item)}
                    title="Edit review"
                    disabled={showAddForm || editingItem}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="admin-action-button danger"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete review"
                    disabled={showAddForm || editingItem}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-manager-container">
        <div className="admin-loading-message">
          <FiRefreshCw className="admin-spin" />
          Loading gallery data...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manager-container">
      <div className="admin-manager-header">
        <h2 className="admin-manager-title">Gallery Management</h2>
        <div className="admin-button-group">
          <button className="admin-btn" onClick={loadGalleryData}>
            <FiRefreshCw />
            Refresh
          </button>
          <button 
            className="admin-btn success" 
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingItem}
          >
            <FiPlus />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          <FiImage />
          Images ({images.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'awards' ? 'active' : ''}`}
          onClick={() => setActiveTab('awards')}
        >
          <FiAward />
          Awards ({awards.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FiMessageSquare />
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Search and Filter */}
      <Card>
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          placeholder={`Search ${activeTab}...`}
          filters={activeTab === 'awards' ? [
            {
              key: 'year',
              label: 'Year',
              type: 'select',
              options: [
                { value: '2020', label: '2020' },
                { value: '2021', label: '2021' },
                { value: '2022', label: '2022' },
                { value: '2023', label: '2023' },
                { value: '2024', label: '2024' }
              ]
            }
          ] : []}
        />
      </Card>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && renderForm()}

      {/* Table */}
      <Card>
        {renderTable()}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
          />
        </Card>
      )}
    </div>
  );
};

export default GalleryManager; 