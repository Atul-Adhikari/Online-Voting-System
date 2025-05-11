import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import styles from "../Styles/UserDashboard.module.css";
import VotingComponent from "./VotingComponent";
import ElectionInfo from "./ElectionInfo";
import Footer from "./Footer";
import Profile from "./Profile";

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();


  const carouselImages = [
    "/Voting1.jpg",
    "/Voting2.jpg",
    "/Voting3.jpg",
    "/Voting4.jpg",
  ];

  const handleLogout = () => {
    navigate("/logout");
  };

  const userProfile = {
    name: localStorage.getItem("userName"),
    profilePic: "/Logo2.png",
  };

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:3333/polls", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch elections.");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setElections(data);
        } else {
          setError("Elections data is not in the expected format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load election data.");
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className={styles.dashboardContainer}>
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
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className={styles.mainContent}>
        <Routes>
          <Route
            index
            element={
              <>
                <h2 className={styles.dashboardTitle}>Welcome, {userProfile.name}!</h2>
                <p className={styles.dashboardSubheading}>Today is {new Date().toLocaleDateString()}</p>

                {error && <p className={styles.errorMessage}>{error}</p>}
                {elections.length === 0 && <p>No elections found.</p>}

                <div className={styles.summaryCards}>
                  <div className={styles.card}><h3>Total Elections</h3><p>{elections.length}</p></div>
                  <div className={styles.card}><h3>Active Elections</h3><p>{elections.filter((e) => e.status === "active").length}</p></div>
                  <div className={styles.card}><h3>Completed Elections</h3><p>{elections.filter((e) => e.status === "completed").length}</p></div>
                </div>

                <div className={styles.carouselContainer}>
                  <img src={carouselImages[currentIndex]} alt={`Slide ${currentIndex + 1}`} className={styles.carouselImage} />
                </div>

                <div className={styles.recentActivity}>
                  <h3>Election Rules</h3>
                  <ul>
                    <li>📝 You must be registered to vote in the election.</li>
                    <li>🗳️ Each voter is allowed to vote only once in each election.</li>
                    <li>🔒 Your vote is confidential and cannot be changed once submitted.</li>
                    <li>🚫 Voting for multiple candidates in the same position will result in disqualification.</li>
                  </ul>
                </div>

                <div className={styles.upcoming}>
                  <h3>Upcoming Elections</h3>
                  {elections.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)).map((e) => (
                    <div key={e._id} className={styles.upcomingItem}>
                      <strong>{e.title}</strong> — Starts: {new Date(e.createdAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>

                <div className={styles.electionGrid}>
                  {elections.map((election) => (
                    <div key={election._id} className={styles.electionCard}>
                      <div className={styles.electionHeader}>
                        <h3>{election.title}</h3>
                        <span className={`${styles.electionStatus} ${election.status === "active" ? styles.statusActive : styles.statusInactive}`}>{election.status || "Unknown"}</span>
                      </div>
                      <p className={styles.electionDescription}>{election.description}</p>
                      <div className={styles.electionMeta}>
                        <p><strong>Address:</strong> {election.address}</p>
                        {election.duration && <p><strong>Duration:</strong> {election.duration} days</p>}
                        <p><strong>Created At:</strong> {new Date(election.createdAt).toLocaleString()}</p>
                      </div>

                      {election.options?.length > 0 && (
                        <>
                          <h4 className={styles.candidateTitle}>Candidates</h4>
                          <div className={styles.candidateGrid}>
                            {election.options.map((opt, idx) => (
                              <div key={idx} className={styles.candidateCard}>
                                {opt.image ? (
                                  <img
                                    src={`http://localhost:3333/uploads/${opt.image}`}
                                    alt={opt.name}
                                    className={styles.candidateImage}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/default-placeholder.png";
                                    }}
                                  />
                                ) : (
                                  <div className={styles.candidateImage} style={{ background: "#ccc" }} />
                                )}
                                <div>{opt.name}</div>
                                {opt.party && <div className={styles.candidateParty}>{opt.party}</div>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
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
