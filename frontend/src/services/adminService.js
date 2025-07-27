import apiRequest from './apiConfig.js';
import sessionManager from './sessionManager.js';

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

    const result = await response.json();
    
    // Store token for API requests
    if (result.token) {
      localStorage.setItem('admin_token', result.token);
    }
    
    // Set authentication state
    sessionManager.setAuthenticated(true);
    return result;
  },

  // Admin logout
  logout: async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const token = localStorage.getItem('admin_token');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${apiUrl}/admin/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies for session management
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // Clear token and authentication state
    localStorage.removeItem('admin_token');
    sessionManager.clearSession();
    return response.json();
  },

  // Check if admin is logged in
  isLoggedIn: async () => {
    try {
      // First check local session state
      if (sessionManager.isLoggedIn()) {
        return true;
      }

      // Then check with server
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/admin/status`, {
        credentials: 'include',
        headers: headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        sessionManager.setAuthenticated(data.logged_in);
        return data.logged_in;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin login status:', error);
      return false;
    }
  },

  // Get session status
  getSessionStatus: () => {
    return sessionManager.getSessionStatus();
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('admin_token');
  },

  // Health check
  healthCheck: async () => {
    return apiRequest('/health');
  },
};

export default adminService; 