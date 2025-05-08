import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import styles from "../Styles/UserDashboard.module.css";
import VotingComponent from "./VotingComponent";
import ElectionInfo from "./ElectionInfo";
import Footer from "./Footer";
import Profile from "./Profile";
import axios from "axios";

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const displayCandidates = () => {
    navigate("/userDashboard/candidates");
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 3000);
  };

  const userProfile = {
    name: "Nepali 123",
    email: "nepali@example.com",
    profilePic: "/Personal.jpg",
  };

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get("http://localhost:3333/api/elections");
        setElections(response.data);
      } catch (err) {
        setError("Failed to load election data.");
      }
    };

    fetchElections();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.profileSection}>
          <img
            src={userProfile.profilePic}
            alt="Profile"
            className={styles.profilePic}
          />
          <h2 className={styles.username}>{userProfile.name}</h2>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/userDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/userDashboard/profile">Profile</Link>
          </li>
          <li>
            <Link to="/userDashboard/candidates">Candidates Panel</Link>
          </li>
          <li>
            <Link to="/userDashboard/electionInfo">Election Info</Link>
          </li>
          <li>
            <Link to="/logout" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <Routes>
          <Route
            index
            element={
              <>
                <h2>Election Overview</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                {elections.length > 0 ? (
                  elections.map((election) => (
                    <div key={election._id} className={styles.electionCard}>
                      <h3>{election.title}</h3>
                      <p>
                        <strong>Description:</strong> {election.description}
                      </p>
                      <p>
                        <strong>Address:</strong> {election.address}
                      </p>
                      {election.status && (
                        <p>
                          <strong>Status:</strong> {election.status}
                        </p>
                      )}
                      {election.duration && (
                        <p>
                          <strong>Duration (days):</strong> {election.duration}
                        </p>
                      )}
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(election.createdAt).toLocaleString()}
                      </p>

                      {election.options?.length > 0 && (
                        <>
                          <h4>Candidates:</h4>
                          <ul>
                            {election.options.map((opt, idx) => (
                              <li key={idx}>{opt}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No elections found.</p>
                )}
              </>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="candidates" element={<VotingComponent />} />
          <Route path="electionInfo" element={<ElectionInfo />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
