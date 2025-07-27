import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/index.js';
import { showSuccess, showError, formatPrice } from '../../services/utils.js';
import Card from '../Card';
import { FiEdit, FiTrash2, FiPlus, FiRefreshCw, FiSave, FiX } from 'react-icons/fi';
import '../../styles/Admin.css';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Starters'
  });

  const categories = ['Starters', 'Main Courses', 'Desserts', 'Beverages'];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Loading menu items...');
      
      const items = await menuService.getAllMenuItems();
      console.log('Menu items loaded:', items);
      
      // Ensure items is always an array
      setMenuItems(Array.isArray(items) ? items : []);
      
    } catch (err) {
      console.error('Error loading menu items:', err);
      showError(`Failed to load menu items: ${err.message}`);
      setMenuItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const newItem = await menuService.createMenuItem({
        ...formData,
        price: parseFloat(formData.price)
      });
      setMenuItems([...menuItems, newItem]);
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: '', category: 'Starters' });
      showSuccess('Menu item added successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const updatedItem = await menuService.updateMenuItem(editingItem.id, {
        ...formData,
        price: parseFloat(formData.price)
      });
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', category: 'Starters' });
      showSuccess('Menu item updated successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      showSuccess('Menu item deleted successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', price: '', category: 'Starters' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="admin-manager-container">
        <div className="admin-loading-message">
          <FiRefreshCw className="admin-spin" />
          Loading menu items...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manager-container">
      <div className="admin-manager-header">
        <h2 className="admin-manager-title">Menu Management</h2>
        <div className="admin-button-group">
          <button className="admin-btn" onClick={loadMenuItems}>
            <FiRefreshCw />
            Refresh
          </button>
          <button 
            className="admin-btn success" 
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingItem}
          >
            <FiPlus />
            Add Item
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <Card>
          <div className="admin-form-container">
            <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category:</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="admin-input"
                  rows="3"
                />
              </div>
              <div className="admin-form-group">
                <label>Price ($):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn success">
                  <FiSave />
                  {editingItem ? 'Update' : 'Add'} Item
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

      {/* Menu Items Table */}
      <Card>
        {menuItems.length === 0 ? (
          <div className="admin-empty-message">No menu items found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => startEdit(item)}
                      title="Edit item"
                      disabled={showAddForm || editingItem}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="admin-action-button danger"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete item"
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

export default MenuManager; 