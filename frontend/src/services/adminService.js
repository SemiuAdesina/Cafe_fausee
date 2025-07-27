import apiRequest from './apiConfig.js';

// Admin Service
export const adminService = {
  // Admin login
  login: async (username, password) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${apiUrl}/admin/login`, {
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
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${apiUrl}/admin/logout`, {
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      // Use the dedicated admin status endpoint
      const response = await fetch(`${apiUrl}/admin/status`, {
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