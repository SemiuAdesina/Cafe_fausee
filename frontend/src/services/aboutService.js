import apiRequest from './apiConfig.js';

// About Service
export const aboutService = {
  // Get about information
  getAboutInfo: async () => {
    return apiRequest('/about/info');
  },

  // Create about information (admin only)
  createAboutInfo: async (aboutData) => {
    return apiRequest('/about/info', {
      method: 'POST',
      body: JSON.stringify(aboutData),
    });
  },

  // Update about information (admin only)
  updateAboutInfo: async (updateData) => {
    return apiRequest('/about/info', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Test endpoint
  testEndpoint: async () => {
    return apiRequest('/about/');
  },
};

export default aboutService; 