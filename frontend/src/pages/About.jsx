import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { aboutService } from '../services/index.js';
import '../styles/About.css';

// Import about images
import chefPortrait from '../assets/about-chef-portrait.jpg';
import kitchenAction from '../assets/about-kitchen-action.jpg';
import teamCollaboration from '../assets/about-team-collaboration.jpg';

// Static about data as fallback (from SRS requirements)
const staticAbout = {
  history: "Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.",
  founders: [
    { name: "Chef Antonio Rossi", description: "Culinary visionary with a passion for Italian cuisine and innovation." },
    { name: "Maria Lopez", description: "Renowned restaurateur dedicated to excellence and hospitality." }
  ],
  commitment: "We are committed to unforgettable dining, excellent food, and locally sourced ingredients."
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAboutInfo();
        if (data && data.length > 0) {
          setAboutData(data[0]); // Use first about info record
          setUseBackend(true);
        } else {
          setAboutData(staticAbout);
          setUseBackend(false);
        }
      } catch (err) {
        // Remove console.log for security
        // console.log('Using static about data:', err.message);
        setAboutData(staticAbout);
        setUseBackend(false);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="about-container">
        <h2 className="page-title">About Café Fausse</h2>
        <Card>
          <div className="loading-message">Loading about information...</div>
        </Card>
      </div>
    );
  }

  const data = aboutData || staticAbout;

  return (
    <div className="about-container">
      <h2 className="page-title">About Café Fausse</h2>
      
      {/* Hero Image Section */}
      <Card>
        <div className="about-hero">
          <img src={chefPortrait} alt="Chef Antonio Rossi" className="about-hero-image" />
          <div className="about-hero-overlay">
            <h3>Meet Our Chef</h3>
            <p>Chef Antonio Rossi - Culinary Visionary</p>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Card>
        <p>{data.history || data.about_text}</p>
        
        {/* Team Section */}
        <div className="about-team-section">
          <h3>Our Team</h3>
          <div className="about-team-grid">
            <div className="about-team-item">
              <img src={kitchenAction} alt="Kitchen in Action" className="about-team-image" />
              <div className="about-team-content">
                <h4>Kitchen Excellence</h4>
                <p>Our passionate team works tirelessly to create exceptional culinary experiences.</p>
              </div>
            </div>
            <div className="about-team-item">
              <img src={teamCollaboration} alt="Team Collaboration" className="about-team-image" />
              <div className="about-team-content">
                <h4>Collaboration</h4>
                <p>Every dish is a result of teamwork, creativity, and dedication to quality.</p>
              </div>
            </div>
          </div>
        </div>

        <h3>Founders</h3>
        <ul>
          {data.founders ? data.founders.map((founder, index) => (
            <li key={useBackend ? founder.id : `static-founder-${index}`}>
              <strong>{founder.name}:</strong> {founder.description}
            </li>
          )) : (
            <>
              <li><strong>Chef Antonio Rossi:</strong> Culinary visionary with a passion for Italian cuisine and innovation.</li>
              <li><strong>Maria Lopez:</strong> Renowned restaurateur dedicated to excellence and hospitality.</li>
            </>
          )}
        </ul>
        <h3>Our Commitment</h3>
        <p>{data.commitment || data.mission || "We are committed to unforgettable dining, excellent food, and locally sourced ingredients."}</p>
      </Card>
    </div>
  );
};

export default About; 