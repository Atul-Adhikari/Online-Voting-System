import React, { useState, useEffect } from "react";
import styles from "../Styles/Profile.module.css";

const Profile = () => {
  // State to hold user profile information
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    province: "",
  });

  // State to track the loading state
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userPhone = localStorage.getItem("phone");
    const userGender = localStorage.getItem("gender");
    const userDob = localStorage.getItem("dob");
    const userProvince = localStorage.getItem("address");

    // If user data exists in localStorage, update the state
    if (userEmail && userName) {
      setUser({
        email: userEmail,
        fullName: userName,
        phone: userPhone || "Not provided",
        gender: userGender || "Not provided",
        dob: userDob
          ? new Date(userDob).toISOString().split("T")[0]
          : "Not provided", // Format DOB to YYYY-MM-DD
        province: userProvince || "Not provided",
      });
    }
    setLoading(false); // Set loading state to false after fetching the data
  }, []);

  // Show loading message while fetching data
  if (loading) {
    return <div className={styles.profile_container}>Loading profile...</div>;
  }

  return (
    <div className={styles.profile_container}>
      {/* Profile card container */}
      <div className={styles.profile_card}>
        <h2>My Profile</h2>
        {/* Info message */}
        <p className={styles.info_message}>
          Here’s the information we have saved for you. If anything looks
          incorrect, please contact support.
        </p>

        {/* Grid to display user profile information */}
        <div className={styles.profile_grid}>
          {/* Display individual profile fields */}
          <div className={styles.profile_box}>
            <span className={styles.box_label}>Full Name</span>
            <span className={styles.box_value}>{user.fullName}</span>
          </div>

          <div className={styles.profile_box}>
            <span className={styles.box_label}>Email</span>
            <span className={styles.box_value}>{user.email}</span>
          </div>

          <div className={styles.profile_box}>
            <span className={styles.box_label}>Phone</span>
            <span className={styles.box_value}>{user.phone}</span>
          </div>

          <div className={styles.profile_box}>
            <span className={styles.box_label}>Gender</span>
            <span className={styles.box_value}>{user.gender}</span>
          </div>

          <div className={styles.profile_box}>
            <span className={styles.box_label}>Date of Birth</span>
            <span className={styles.box_value}>{user.dob}</span>
          </div>

          <div className={styles.profile_box}>
            <span className={styles.box_label}>Province</span>
            <span className={styles.box_value}>{user.province}</span>
          </div>
        </div>

        {/* Support message with a button to contact support */}
        <p className={styles.support_message}>
          Need changes?{" "}
          <button
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=strawhatonlinevotingsystem@gmail.com&su=Support%20Request&body=Hello,%20I%20need%20help%20with...",
                "_blank"
              )
            }
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Click here to email our support team
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default Profile;
