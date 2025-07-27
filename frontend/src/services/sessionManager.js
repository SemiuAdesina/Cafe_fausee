// Session Manager for Admin Authentication
class SessionManager {
  constructor() {
    this.isAuthenticated = false;
    this.sessionKey = 'admin_session';
  }

  // Set authentication state
  setAuthenticated(authenticated) {
    this.isAuthenticated = authenticated;
    if (authenticated) {
      localStorage.setItem(this.sessionKey, 'true');
    } else {
      localStorage.removeItem(this.sessionKey);
    }
  }

  // Check if authenticated
  isLoggedIn() {
    return this.isAuthenticated || localStorage.getItem(this.sessionKey) === 'true';
  }

  // Clear session
  clearSession() {
    this.isAuthenticated = false;
    localStorage.removeItem(this.sessionKey);
  }

  // Get session status
  getSessionStatus() {
    return {
      isAuthenticated: this.isLoggedIn(),
      hasLocalStorage: localStorage.getItem(this.sessionKey) === 'true'
    };
  }
}

// Create singleton instance
const sessionManager = new SessionManager();
export default sessionManager; 