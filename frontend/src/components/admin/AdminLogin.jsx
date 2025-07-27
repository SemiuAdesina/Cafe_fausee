import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/index.js';
import { showSuccess, showError } from '../../services/utils.js';
import Card from '../Card';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import '../../styles/Admin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setDebugInfo('');

    try {
      const result = await adminService.login(credentials.username, credentials.password);
      showSuccess('Login successful!');
      setMessage('Login successful! Redirecting...');
      
      // Get session status for debugging
      const sessionStatus = adminService.getSessionStatus();
      setDebugInfo(`Session Status: ${JSON.stringify(sessionStatus, null, 2)}`);
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (error) {
      showError(error.message);
      setMessage(error.message);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Card>
        <div className="admin-login-header">
          <button 
            className="admin-back-btn" 
            onClick={() => navigate('/')}
            title="Back to Homepage"
          >
            <FiArrowLeft />
            Back to Home
          </button>
        </div>
        
        <h2 className="admin-welcome-title admin-text-center admin-mb-6">
          Admin Login
        </h2>
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <span className="admin-input-icon">
              <FiUser />
            </span>
            <input
              className="admin-input"
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-input-group">
            <span className="admin-input-icon">
              <FiLock />
            </span>
            <input
              className="admin-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              className="admin-password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {message && (
            <div className={`admin-message ${message.includes('error') || message.includes('failed') ? 'error' : ''}`}>
              {message}
            </div>
          )}

          {debugInfo && (
            <div className="admin-debug-info" style={{ 
              background: '#f0f0f0', 
              padding: '10px', 
              margin: '10px 0', 
              borderRadius: '5px', 
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap'
            }}>
              {debugInfo}
            </div>
          )}

          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin; 