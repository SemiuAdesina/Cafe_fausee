import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/index.js';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ReservationsManager from '../../components/admin/ReservationsManager';
import NewsletterManager from '../../components/admin/NewsletterManager';
import MenuManager from '../../components/admin/MenuManager';
import GalleryManager from '../../components/admin/GalleryManager';
import AboutManager from '../../components/admin/AboutManager';
import { FiHome, FiCalendar, FiMail, FiUsers, FiMenu, FiImage, FiInfo } from 'react-icons/fi';
import '../../styles/Admin.css';



const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    reservations: 0,
    newsletterSignups: 0,
    menuItems: 0,
    galleryItems: 0
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await adminService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        // Load dashboard stats
        loadDashboardStats();
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const loadDashboardStats = async () => {
    // This would load actual stats from the backend
    // For now, we'll use placeholder data
    setStats({
      reservations: 15,
      newsletterSignups: 42,
      menuItems: 12,
      galleryItems: 8
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveSection('dashboard');
    loadDashboardStats();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    // Redirect to home page after logout
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="admin-content">
            <div className="admin-welcome-section">
              <h1 className="admin-welcome-title">Welcome to Café Fausse Admin</h1>
              <p className="admin-welcome-text">
                Manage your restaurant's reservations, newsletter, menu, and gallery content.
              </p>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <FiCalendar />
                </div>
                <div className="admin-stat-number">{stats.reservations}</div>
                <div className="admin-stat-label">Active Reservations</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <FiMail />
                </div>
                <div className="admin-stat-number">{stats.newsletterSignups}</div>
                <div className="admin-stat-label">Newsletter Subscribers</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <FiHome />
                </div>
                <div className="admin-stat-number">{stats.menuItems}</div>
                <div className="admin-stat-label">Menu Items</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <FiUsers />
                </div>
                <div className="admin-stat-number">{stats.galleryItems}</div>
                <div className="admin-stat-label">Gallery Items</div>
              </div>
            </div>

            <div className="admin-quick-actions">
              <h3 className="admin-quick-actions-title">Quick Actions</h3>
              <div className="admin-action-buttons">
                <button className="admin-action-btn" onClick={() => setActiveSection('reservations')}>
                  <div className="admin-action-icon">
                    <FiCalendar />
                  </div>
                  <div className="admin-action-text">Manage Reservations</div>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('newsletter')}>
                  <div className="admin-action-icon">
                    <FiMail />
                  </div>
                  <div className="admin-action-text">Newsletter Subscribers</div>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('menu')}>
                  <div className="admin-action-icon">
                    <FiHome />
                  </div>
                  <div className="admin-action-text">Menu Management</div>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('gallery')}>
                  <div className="admin-action-icon">
                    <FiUsers />
                  </div>
                  <div className="admin-action-text">Gallery Management</div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'reservations':
        return <ReservationsManager />;
      case 'newsletter':
        return <NewsletterManager />;
      case 'menu':
        return <MenuManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'about':
        return <AboutManager />;
      default:
        return <div>Section not found</div>;
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      {renderSection()}
    </div>
  );
};

export default AdminDashboard; 