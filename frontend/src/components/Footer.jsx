import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="footer-content">
        <div className="footer-brand">
          <strong>Café Fausse</strong>
        </div>
        <div className="footer-info">
          <div>
            <span className="footer-label">Address:</span>
            1234 Culinary Ave, Suite 100, Washington, DC 20002
          </div>
          <div>
            <span className="footer-label">Phone:</span>
            (202) 555-4567
          </div>
          <div>
            <span className="footer-label">Hours:</span>
            Mon–Sat: 5PM–11PM, Sun: 5PM–9PM
          </div>
        </div>
      </div>
      <div className="footer-nav">
        <a href="/" onClick={e => {
          e.preventDefault();
          const el = document.querySelector('.newsletter-section');
          if (el) {
            // Smooth scroll to newsletter section
            el.scrollIntoView({ behavior: 'smooth' });
            
            // Add blink effect after scroll
            setTimeout(() => {
              el.classList.add('newsletter-blink');
              setTimeout(() => {
                el.classList.remove('newsletter-blink');
              }, 2000); // Remove blink effect after 2 seconds
            }, 500); // Wait for scroll to complete
          } else {
            // If newsletter section doesn't exist (like on admin dashboard), 
            // navigate to home page where it exists
            window.location.href = '/';
          }
        }}>Newsletter Signup</a>
      </div>
    </div>
    <div className="footer-copyright">
      &copy; {new Date().getFullYear()} Café Fausse &mdash; Fine Dining in Washington, DC. All rights reserved.
    </div>
  </footer>
);

export default Footer; 