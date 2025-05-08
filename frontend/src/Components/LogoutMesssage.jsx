import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/LogoutMessage.module.css";

const LogoutMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user-related data if needed
    localStorage.clear();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className={styles.logoutMessage}>
      <img src="/Loading_icon.gif" alt="Loading..." />
      <p>Please wait while logging out.....</p>
    </div>
  );
};

export default LogoutMessage;
