import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = ({ right }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar-logo">
          <Link to="/">
            <FaUtensils style={{ color: '#00ffc8', marginRight: 8, verticalAlign: 'middle', fontSize: '1.5rem' }} />
            <span className="logo-text">Café Fausse</span>
          </Link>
        </div>
        <div className="navbar-center">
          <div className="navbar-links-container">
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/reservations">Reservations</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>
        </div>
        <div className="navbar-actions">
          <div className="navbar-admin-container">
            <Link to="/admin" className="navbar-admin-link">
              <FiUsers size={20} />
            </Link>
            <div className="navbar-admin-tooltip">Admin Navigation</div>
          </div>
          <span className="navbar-theme-toggle">{right}</span>
          <button className="navbar-menu-toggle" onClick={handleMenuToggle} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile side menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={handleCloseMenu}>
          <FaTimes className="close-icon light" size={24} />
          <FaTimes className="close-icon dark" size={24} />
        </button>
        
        <ul className="mobile-menu-links">
          <li><Link to="/" onClick={handleCloseMenu}>Home</Link></li>
          <li><Link to="/menu" onClick={handleCloseMenu}>Menu</Link></li>
          <li><Link to="/reservations" onClick={handleCloseMenu}>Reservations</Link></li>
          <li><Link to="/about" onClick={handleCloseMenu}>About Us</Link></li>
          <li><Link to="/gallery" onClick={handleCloseMenu}>Gallery</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 