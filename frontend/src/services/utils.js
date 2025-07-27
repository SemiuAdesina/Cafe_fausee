// Utility functions for the frontend

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Date formatting
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Time formatting
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// DateTime formatting
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Generate future date for reservation (default: tomorrow at 7 PM)
export const getDefaultReservationDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);
  return tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
};

// Validate reservation data
export const validateReservationData = (data) => {
  const errors = {};

  if (!data.time_slot) {
    errors.time_slot = 'Time slot is required';
  } else {
    const selectedDate = new Date(data.time_slot);
    const now = new Date();
    if (selectedDate <= now) {
      errors.time_slot = 'Time slot must be in the future';
    }
  }

  if (!data.number_of_guests || data.number_of_guests < 1 || data.number_of_guests > 20) {
    errors.number_of_guests = 'Number of guests must be between 1 and 20';
  }

  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = 'Customer name must be at least 2 characters';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage utilities
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Toast notification functions
export const showSuccess = (message) => {
  // Remove console.log for security
  // console.log('Success:', message);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

export const showError = (message) => {
  // Remove console.log for security
  // console.log('Error:', message);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Remove toast after 5 seconds for errors
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 5000);
};

export const showWarning = (message) => {
  if (window.showToast) {
    window.showToast(message, 'warning', 5000);
  } else {
    console.warn('Warning:', message);
  }
};

export const showInfo = (message) => {
  // Remove console.log for security
  // console.log('Info:', message);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast toast-info';
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

export const showLoading = (message) => {
  // Remove console.log for security
  // console.log('Loading:', message);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast toast-loading';
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  return toast;
}; 