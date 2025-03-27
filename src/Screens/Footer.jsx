
import React from "react";
import "./css/Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Click&Buy. Todos los derechos reservados.</p>
      <div className="social-media">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
