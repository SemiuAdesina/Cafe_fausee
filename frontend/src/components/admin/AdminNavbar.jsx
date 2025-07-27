import React from 'react';
import { adminService } from '../../services/index.js';
import { showSuccess, showError } from '../../services/utils.js';
import { FiLogOut, FiHome, FiCalendar, FiMail, FiMenu, FiImage, FiInfo, FiUsers } from 'react-icons/fi';
import '../../styles/Admin.css';



const AdminNavbar = ({ activeSection, onSectionChange, onLogout }) => {
  const handleLogout = async () => {
    try {
      await adminService.logout();
      showSuccess('Logged out successfully');
      onLogout();
    } catch (error) {
      showError('Logout failed: ' + error.message);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'reservations', label: 'Reservations', icon: <FiCalendar /> },
    { id: 'newsletter', label: 'Newsletter', icon: <FiMail /> },
    { id: 'menu', label: 'Menu', icon: <FiMenu /> },
    { id: 'gallery', label: 'Gallery', icon: <FiImage /> },
    { id: 'about', label: 'About', icon: <FiInfo /> },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <div className="admin-logo">
          <FiUsers />
          Café Fausse Admin
        </div>
        
        <div className="admin-nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 