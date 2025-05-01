import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Footer.css';


const Footer = () => {
    return (
      <footer className="footer py-4 text-white text-center alignment footerbackground">
        <div className="container">
          <p>&copy; 2025 Pakistan Meteorological Department. All Rights Reserved.</p>
          <div className="social-links mt-3">
            <a href="#" className="text-white me-3">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-white me-3">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white me-3">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-white">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;