import { apiRequest } from './apiConfig.js';

// Email notification service for reservation changes
export const emailService = {
  // Send reservation confirmation email
  sendReservationConfirmation: async (reservationData) => {
    try {
      const response = await apiRequest('/email/reservation-confirmation', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
      return response;
    } catch (error) {
      console.error('Failed to send reservation confirmation:', error);
      throw error;
    }
  },

  // Send reservation cancellation email
  sendReservationCancellation: async (reservationData) => {
    try {
      const response = await apiRequest('/email/reservation-cancellation', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
      return response;
    } catch (error) {
      console.error('Failed to send reservation cancellation:', error);
      throw error;
    }
  },

  // Send reservation update email
  sendReservationUpdate: async (reservationData) => {
    try {
      const response = await apiRequest('/email/reservation-update', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
      return response;
    } catch (error) {
      console.error('Failed to send reservation update:', error);
      throw error;
    }
  },

  // Send newsletter welcome email
  sendNewsletterWelcome: async (emailData) => {
    try {
      const response = await apiRequest('/email/newsletter-welcome', {
        method: 'POST',
        body: JSON.stringify(emailData)
      });
      return response;
    } catch (error) {
      console.error('Failed to send newsletter welcome:', error);
      throw error;
    }
  },

  // Send admin notification for new reservation
  sendAdminNotification: async (reservationData) => {
    try {
      const response = await apiRequest('/email/admin-notification', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
      return response;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw error;
    }
  },

  // Test email service
  testEmailService: async () => {
    try {
      const response = await apiRequest('/email/test', {
        method: 'POST',
        body: JSON.stringify({ test: true })
      });
      return response;
    } catch (error) {
      console.error('Failed to test email service:', error);
      throw error;
    }
  }
};

export default emailService; 