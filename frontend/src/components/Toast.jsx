import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiX />;
      case 'warning':
        return <FiAlertTriangle />;
      case 'info':
        return <FiInfo />;
      default:
        return <FiAlertCircle />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>
        <FiX />
      </button>
      <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

export default Toast; 