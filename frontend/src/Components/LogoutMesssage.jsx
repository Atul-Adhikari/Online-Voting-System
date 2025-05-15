import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/LogoutMessage.module.css";

const LogoutMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); // Clear user-related data

    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.logoutMessage}>
      <div className={styles.logoutBox}>
        <img src="/Loading_icon.gif" alt="Loading..." />
        <p>Please wait while logging out...</p>
      </div>
    </div>
  );
};

export default LogoutMessage;
