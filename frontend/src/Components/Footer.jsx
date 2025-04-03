import React from "react";
import styles from "../Styles/Footer.module.css";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* About Us */}
        <div className={styles.aboutSection}>
          <h4>About Us</h4>
          <p>
            We are committed to providing a secure and efficient online voting
            system to ensure transparency and accessibility for all voters.
          </p>
        </div>

        {/* Useful Links */}
        <div className={styles.linksSection}>
          <h4>Useful Links</h4>
          <ul>
            <li>
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/help" target="_blank" rel="noopener noreferrer">
                Help & Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.contactSection}>
          <h4>Contact Us</h4>
          <p>Email: support@votingsystem.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>

      {/* Social Media Section - Follow Us */}
      <div className={styles.socialSection}>
        <h4>Follow Us</h4>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook/>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter/>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram/>
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <p>&copy; 2025 Online Voting System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
