import React from "react";
import styles from "../Styles/SplashPage.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  return (
    <div className={styles.firstContainer}>
      <div className={styles.leftContent}>
        {/* Website Name */}
        <h2 className={styles.siteName}>E-मत</h2>

        {/* Welcome Message */}
        <h1>Welcome to the Online Voting System!</h1>

        {/* Short Description */}
        <p className={styles.shortDescription}>
          E-MAT is a secure, transparent, and user-friendly online voting system
          that empowers voters to cast their ballots from anywhere, ensuring
          fairness and accessibility for all.
        </p>

        <button className={styles.getStarted} onClick={navigateToLogin}>
          Get Started <FaArrowRightLong />
        </button>
      </div>

      <div className={styles.rightContent}>
        <img
          src="/Logo2.png"
          alt="Voting System Logo"
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default SplashPage;
