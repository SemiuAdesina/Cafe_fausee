// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Common headers for API requests
export const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Common error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data?.error || 'An error occurred';
  }
  return 'Network error. Please check your connection.';
};

// Base API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    credentials: 'include', // Include cookies for session management
    ...options,
  };

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for production
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server may not be responding');
    }
    throw error;
  }
};

export default apiRequest; 