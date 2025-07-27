import apiRequest from './apiConfig.js';

// Reservation Service
export const reservationService = {
  // Create a new reservation
  createReservation: async (reservationData) => {
    return apiRequest('/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  // Get all reservations (admin only)
  getAllReservations: async () => {
    return apiRequest('/reservations/all');
  },

  // Update a reservation (admin only)
  updateReservation: async (reservationId, updateData) => {
    return apiRequest(`/reservations/${reservationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a reservation (admin only)
  deleteReservation: async (reservationId) => {
    return apiRequest(`/reservations/${reservationId}`, {
      method: 'DELETE',
    });
  },

  // Export reservations as CSV (admin only)
  exportReservationsCSV: async () => {
    const response = await fetch('http://localhost:5001/api/reservations/export', {
      credentials: 'include', // Include cookies for admin session
    });
    
    if (!response.ok) {
      throw new Error('Failed to export reservations');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Customer lookup reservation
  lookupReservation: async (email, reservationId) => {
    return apiRequest(`/reservations/lookup?email=${encodeURIComponent(email)}&reservation_id=${reservationId}`);
  },

  // Customer cancel reservation
  cancelReservation: async (email, reservationId) => {
    return apiRequest('/reservations/lookup', {
      method: 'DELETE',
      body: JSON.stringify({ email, reservation_id: reservationId }),
    });
  },

  // Test endpoint
  testEndpoint: async () => {
    return apiRequest('/reservations/');
  },
};

export default reservationService; 