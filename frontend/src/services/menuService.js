import apiRequest from './apiConfig.js';

// Menu Service
export const menuService = {
  // Get all menu items
  getMenuItems: async () => {
    return apiRequest('/menu/items');
  },

  // Get all menu items (alias for MenuManager)
  getAllMenuItems: async () => {
    return apiRequest('/menu/items');
  },

  // Get a specific menu item
  getMenuItem: async (itemId) => {
    return apiRequest(`/menu/items/${itemId}`);
  },

  // Create a new menu item (admin only)
  createMenuItem: async (menuItemData) => {
    return apiRequest('/menu/items', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  },

  // Update a menu item (admin only)
  updateMenuItem: async (itemId, updateData) => {
    return apiRequest(`/menu/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a menu item (admin only)
  deleteMenuItem: async (itemId) => {
    return apiRequest(`/menu/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Test endpoint
  testEndpoint: async () => {
    return apiRequest('/menu/');
  },
};

export default menuService; 