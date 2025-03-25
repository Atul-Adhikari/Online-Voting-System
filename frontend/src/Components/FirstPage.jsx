import React from "react";
import styles from "../Styles/FirstPage.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
const FirstPage = () => {
  return (
    <div className={styles.firstContainer}>
      <div className={styles.leftContent}>
        <h1>Welcome to the Online Voting System!</h1>
        <p>
          A secure, transparent, and easy way to cast your vote from anywhere.
        </p>
        <button className={styles.getStarted}>
          Get Started <FaArrowRightLong />{" "}
        </button>
      </div>

      <div className={styles.rightContent}>
        <img
          src="/votingLogo"
          alt="Voting System Logo"
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default FirstPage;
