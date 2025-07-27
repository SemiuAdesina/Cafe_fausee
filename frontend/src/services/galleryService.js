import apiRequest from './apiConfig.js';

// Gallery Service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async () => {
    return apiRequest('/gallery/images');
  },

  // Get all gallery images (alias for GalleryManager)
  getAllImages: async () => {
    return apiRequest('/gallery/images');
  },

  // Get a specific gallery image
  getGalleryImage: async (imageId) => {
    return apiRequest(`/gallery/images/${imageId}`);
  },

  // Upload a new gallery image (admin only)
  uploadGalleryImage: async (imageFile, caption = '') => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', caption);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const response = await fetch(`${apiUrl}/gallery/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include cookies for admin session
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // Update a gallery image (admin only)
  updateGalleryImage: async (imageId, updateData) => {
    return apiRequest(`/gallery/images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a gallery image (admin only)
  deleteGalleryImage: async (imageId) => {
    return apiRequest(`/gallery/images/${imageId}`, {
      method: 'DELETE',
    });
  },

  // Create a new gallery image (admin only) - alias for GalleryManager
  createImage: async (imageData) => {
    return apiRequest('/gallery/images', {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  },

  // Update a gallery image (admin only) - alias for GalleryManager
  updateImage: async (imageId, updateData) => {
    return apiRequest(`/gallery/images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a gallery image (admin only) - alias for GalleryManager
  deleteImage: async (imageId) => {
    return apiRequest(`/gallery/images/${imageId}`, {
      method: 'DELETE',
    });
  },

  // Get all awards
  getAwards: async () => {
    return apiRequest('/gallery/awards');
  },

  // Get all awards (alias for GalleryManager)
  getAllAwards: async () => {
    return apiRequest('/gallery/awards');
  },

  // Get a specific award
  getAward: async (awardId) => {
    return apiRequest(`/gallery/awards/${awardId}`);
  },

  // Create a new award (admin only)
  createAward: async (awardData) => {
    return apiRequest('/gallery/awards', {
      method: 'POST',
      body: JSON.stringify(awardData),
    });
  },

  // Update an award (admin only)
  updateAward: async (awardId, updateData) => {
    return apiRequest(`/gallery/awards/${awardId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete an award (admin only)
  deleteAward: async (awardId) => {
    return apiRequest(`/gallery/awards/${awardId}`, {
      method: 'DELETE',
    });
  },

  // Get all reviews
  getReviews: async () => {
    return apiRequest('/gallery/reviews');
  },

  // Get all reviews (alias for GalleryManager)
  getAllReviews: async () => {
    return apiRequest('/gallery/reviews');
  },

  // Get a specific review
  getReview: async (reviewId) => {
    return apiRequest(`/gallery/reviews/${reviewId}`);
  },

  // Create a new review (admin only)
  createReview: async (reviewData) => {
    return apiRequest('/gallery/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update a review (admin only)
  updateReview: async (reviewId, updateData) => {
    return apiRequest(`/gallery/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a review (admin only)
  deleteReview: async (reviewId) => {
    return apiRequest(`/gallery/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Test endpoint
  testEndpoint: async () => {
    return apiRequest('/gallery/');
  },
};

export default galleryService; 