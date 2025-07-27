import apiRequest from './apiConfig.js';

// Newsletter Service
export const newsletterService = {
  // Sign up for newsletter
  signupNewsletter: async (email) => {
    return apiRequest('/newsletter/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Get all newsletter signups (admin only)
  getAllSignups: async () => {
    return apiRequest('/newsletter/all');
  },

  // Export newsletter signups as CSV (admin only)
  exportNewsletterCSV: async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const response = await fetch(`${apiUrl}/newsletter/export`, {
      credentials: 'include', // Include cookies for admin session
    });
    
    if (!response.ok) {
      throw new Error('Failed to export newsletter signups');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_signups.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Test endpoint
  testEndpoint: async () => {
    return apiRequest('/newsletter/');
  },
};

export default newsletterService; 