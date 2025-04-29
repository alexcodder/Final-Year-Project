import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About EHA</h3>
          <p>Emergency Healthcare Assistance provides quick access to emergency medical services in Kathmandu.</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/team">Medical Team</Link></li>
            <li><Link to="/coverage">Coverage Areas</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Emergency Services</h3>
          <ul>
            <li><Link to="/ambulance">Ambulance Service</Link></li>
            <li><Link to="/hospital">Hospital Directory</Link></li>
            <li><Link to="/blood-bank">Blood Bank</Link></li>
            <li><Link to="/emergency">Emergency Response</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <p><i className="fas fa-phone"></i> Emergency: +977 9841234567</p>
            <p><i className="fas fa-envelope"></i> support@eha.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Kathmandu, Nepal</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} Emergency Healthcare Assistance. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
