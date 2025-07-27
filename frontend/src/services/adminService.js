import apiRequest from './apiConfig.js';

// Admin Service
export const adminService = {
  // Admin login
  login: async (username, password) => {
    const response = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // Admin logout
  logout: async () => {
    const response = await fetch('http://localhost:5001/api/admin/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // Check if admin is logged in
  isLoggedIn: async () => {
    try {
      // Use the dedicated admin status endpoint
      const response = await fetch('http://localhost:5001/api/admin/status', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.logged_in;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin login status:', error);
      return false;
    }
  },

  // Health check
  healthCheck: async () => {
    return apiRequest('/health');
  },
};

export default adminService; 