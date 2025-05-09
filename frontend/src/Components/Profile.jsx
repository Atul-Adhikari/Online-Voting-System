import React, { useState, useEffect } from "react";
import styles from "../Styles/Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    province: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userPhone = localStorage.getItem("phone");
    const userGender = localStorage.getItem("gender");
    const userDob = localStorage.getItem("dob");
    const userProvince = localStorage.getItem("address");

    if (userEmail && userName) {
      setUser({
        email: userEmail,
        fullName: userName,
        phone: userPhone || "Not provided",
        gender: userGender || "Not provided",
        dob: userDob
          ? new Date(userDob).toISOString().split("T")[0]
          : "Not provided",
        province: userProvince || "Not provided",
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className={styles.profile_container}>Loading profile...</div>;
  }

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_card}>
        <h2>My Profile</h2>
        <p className={styles.info_message}>
          Here’s the information we have saved for you. If anything looks
          incorrect, please contact support.
        </p>

        <div className={styles.profile_grid}>
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

        <p className={styles.support_message}>
          Need changes?{" "}
          <button
            onClick={() =>
              window.open("mailto:strawhatonlinevotingsystem@gmail.com")
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
