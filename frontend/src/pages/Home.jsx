import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaCalendarCheck, FaUser } from 'react-icons/fa';
import Card from '../components/Card';
import NewsletterForm from '../components/NewsletterForm';
import '../styles/Home.css';
import heroImage from '../assets/home-cafe-fausse.webp';

const Home = () => (
  <div className="main-content">
    <div className="home-hero">
      <img src={heroImage} alt="Café Fausse Restaurant" className="hero-img" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1><FaUtensils style={{ color: '#00ffc8', marginRight: 8 }} />Café Fausse</h1>
        <div className="hero-subtitle">
          <p className="animated-text">1234 Culinary Ave, Suite 100, Washington, DC 20002</p>
          <p className="animated-text delay-1">Phone: (202) 555-4567</p>
          <p className="animated-text delay-2">Hours: Mon–Sat: 5PM–11PM, Sun: 5PM–9PM</p>
        </div>
      </div>
    </div>
    <div className="home-card-row">
      <Card>
        <h2>Welcome to Café Fausse</h2>
        <p>Experience fine dining with a modern twist. Reserve your table or explore our menu!</p>
      </Card>
      <Card dark>
        <h2>Night Mode Example</h2>
        <p>Enjoy a glowing experience even in the dark. Try our night ambiance!</p>
      </Card>
    </div>
    
    <section className="my-reservations-section">
      <div className="my-reservations-container">
        <div className="my-reservations-header">
          <FaUser className="my-reservations-icon" />
          <h2>My Reservations</h2>
          <p>View and manage your upcoming dining reservations</p>
        </div>
        <div className="my-reservations-actions">
          <Link to="/customer-service" className="my-reservations-btn primary">
            <FaCalendarCheck />
            View My Reservations
          </Link>
          <Link to="/reservations" className="my-reservations-btn secondary">
            <FaUtensils />
            Book New Table
          </Link>
        </div>
      </div>
    </section>
    <section className="newsletter-section">
      <h2>Get Exclusive Chef Specials & Reservation Alerts</h2>
      <p>Sign up for our newsletter and be the first to know about special events, new menu items, and exclusive offers!</p>
      <div className="newsletter-form-wrapper">
        <NewsletterForm />
      </div>
    </section>
    {/* Navigation below newsletter removed as requested */}
  </div>
);

export default Home; 