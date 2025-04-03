import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import styles from "../Styles/UserDashboard.module.css";
import VotingComponent from "./VotingComponent";
import ElectionInfo from "./ElectionInfo";
import Footer from "./Footer";
import { FaFacebook } from "react-icons/fa";
import Profile from "./Profile";

const UserDashboard = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const displayCandidates = () => {
    navigate("/userDashboard/candidates");
  };

  const handleLogout = () => {
    setLoading(true); // Start loading animation

    // Simulate a 3-second delay before redirecting to login
    setTimeout(() => {
      // After 3 seconds, stop loading and redirect to login
      setLoading(false);
      navigate("/login"); // Redirect to login page
    }, 3000); // 3000 ms = 3 seconds
  };

  const userProfile = {
    name: "Nepali 123",
    email: "nepali@example.com",
    profilePic: "/Personal.jpg",
  };

  const upcomingElection = {
    date: "2025-04-15",
    name: "General Election 2025",
    description: "Choose your next representatives.",
  };

  // Array of previous election images
  // const previousElections = [
  //   "/Voting1.jpg",
  //   "/Voting2.jpg",
  //   "/Voting3.jpg",
  //   "/Voting4.jpg",
  // ];
  const previousElections = [
    {
      year: 2023,
      name: "Presidential Election 2023",
      winner: "John Doe",
      party: "Democratic Party",
      votes: "12,540,000",
      turnout: 67.5,
    },
    {
      year: 2021,
      name: "Parliamentary Election 2021",
      winner: "Jane Smith",
      party: "Republican Party",
      votes: "9,780,000",
      turnout: 58.3,
    },
    {
      year: 2019,
      name: "Local Election 2019",
      winner: "Michael Lee",
      party: "Independent",
      votes: "4,320,000",
      turnout: 45.2,
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === previousElections.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [previousElections.length]);

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

      {/* Main Content - Render based on Nested Routes */}
      <div className={styles.mainContent}>
        <Routes>
          <Route
            index
            element={
              <>
                {/* Previous Elections Results */}

                {/* Upcoming Election */}
                <div className={styles.upcomingElection}>
                  <h2>Upcoming Election</h2>
                  <div className={styles.electionCard}>
                    <h3>{upcomingElection.name}</h3>
                    <p>{upcomingElection.description}</p>
                    <p>
                      <strong>Election Date:</strong> {upcomingElection.date}
                    </p>
                    <button
                      className={styles.candidatesButton}
                      onClick={displayCandidates}
                    >
                      View Candidates
                    </button>
                  </div>
                </div>

                {/* Previous Elections Image Carousel */}
                <div className={styles.previousElections}>
                  <h2>Past Election Results</h2>
                  <div className={styles.electionResults}>
                    {previousElections.length > 0 ? (
                      previousElections.map((election, index) => (
                        <div key={index} className={styles.electionCard}>
                          <div className={styles.electionHeader}>
                            <h3>{election.name}</h3>
                            <span className={styles.electionYear}>
                              {election.year}
                            </span>
                          </div>
                          <p>
                            <strong>Winner:</strong> {election.winner}
                          </p>
                          <p>
                            <strong>Party:</strong> {election.party}
                          </p>
                          <div className={styles.voteStats}>
                            <p>
                              🗳️ <strong>Votes Received:</strong>{" "}
                              {election.votes}
                            </p>
                            <p>
                              📊 <strong>Turnout:</strong> {election.turnout}%
                            </p>
                          </div>
                          <button className={styles.detailsButton}>
                            View More
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No past election results available.</p>
                    )}
                  </div>
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
