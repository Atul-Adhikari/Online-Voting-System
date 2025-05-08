import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  useEffect(() => {
    axios
      .get("https://your-backend-api.com/user")
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put("https://your-backend-api.com/update-profile", user);
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_card}>
        <h2>My Profile</h2>
        <div className={styles.profile_details}>
          <div className={styles.profile_picture}>
            <img
              src="/Personal.jpg"
              alt="User Profile"
              className={styles.user_avatar}
            />
          </div>

          <div className={styles.form_grid}>
            <div className={styles.input_group}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className={styles.input_group}>
              <label>Email</label>
              <input type="email" name="email" value={user.email} disabled />
            </div>

            <div className={styles.input_group}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className={styles.input_group}>
              <label>Gender</label>
              <select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                disabled={!editMode}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.input_group}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={user.dob}
                disabled={!editMode}
              />
            </div>

            <div className={styles.input_group}>
              <label>Province</label>
              <select
                name="province"
                value={user.province}
                onChange={handleChange}
                disabled={!editMode}
              >
                <option value="">Select Province</option>
                {nepaliProvinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.profile_actions}>
            {editMode ? (
              <>
                <button
                  className={styles.save_btn}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancel_btn}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className={styles.edit_btn}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
