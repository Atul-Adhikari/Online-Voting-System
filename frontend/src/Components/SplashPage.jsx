import React from "react";
import styles from "../Styles/SplashPage.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate(); // React Router's useNavigate hook for navigation

  // Function to navigate to the login page when the "Get Started" button is clicked
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.firstContainer}>
      {/* Left content section with website name, description, and button */}
      <div className={styles.leftContent}>
        {/* Website Name */}
        <h2 className={styles.siteName}>E-मत</h2>

        {/* Welcome Message */}
        <h1>Welcome to the Online Voting System!</h1>

        {/* Short Description of the Voting System */}
        <p className={styles.shortDescription}>
          E-MAT is a secure, transparent, and user-friendly online voting system
          that empowers voters to cast their ballots from anywhere, ensuring
          fairness and accessibility for all.
        </p>

        {/* Button that triggers the navigation to the login page */}
        <button className={styles.getStarted} onClick={navigateToLogin}>
          Get Started <FaArrowRightLong /> {/* Icon on the button */}
        </button>
      </div>

      {/* Right content section with the logo */}
      <div className={styles.rightContent}>
        <img
          src="/Logo2.png"
          alt="Voting System Logo" // Alt text for accessibility
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default SplashPage;
