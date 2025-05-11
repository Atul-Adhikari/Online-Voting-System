import React, { useEffect, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import styles from "../Styles/ElectionInfo.module.css";

const ElectionInfo = () => {
  const [poll, setPoll] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3333/polls", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const latestPoll = data[0];
          setPoll(latestPoll);
          setCandidates(latestPoll.options || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/Logo2.png" alt="Election Logo" />
        <h1>Election Overview</h1>
      </div>

      {loading ? (
        <p className={styles.loading}>Fetching election data...</p>
      ) : poll ? (
        <>
          <section className={styles.section}>
            <h2>{poll.title}</h2>
            <p>{poll.description}</p>
            <div className={styles.meta}>
              <span>📍 {poll.address}</span>
              <span className={`${styles.status} ${poll.status === "active" ? styles.active : styles.inactive}`}>
                {poll.status.toUpperCase()}
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h2>📅 Important Dates</h2>
            <ul className={styles.dates}>
              <li><strong>📝 Registration Closes:</strong> April 15, 2025</li>
              <li><strong>🗳️ Voting Opens:</strong> April 20, 2025</li>
              <li><strong>🕔 Voting Closes:</strong> April 25, 2025</li>
              <li><strong>📢 Results Announcement:</strong> April 30, 2025</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2><IoPeopleSharp /> Meet the Candidates</h2>
            <div className={styles.candidatesGrid}>
              {candidates.length === 0 ? (
                <p>No candidates registered.</p>
              ) : (
                candidates.map((candidate, index) => (
                  <div key={index} className={styles.card}>
                    <img
                      src={candidate.image || "/default-candidate.png"}
                      alt={candidate.name}
                      className={styles.avatar}
                    />
                    <h3>{candidate.name}</h3>
                    <p><strong>Votes:</strong> {candidate.votes}</p>
                    {candidate.party && <p className={styles.party}>({candidate.party})</p>}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>✅ How to Vote</h2>
            <ol className={styles.instructions}>
              <li>Register before April 15, 2025 using your verified ID.</li>
              <li>Login to the system and select your preferred candidate.</li>
              <li>Click 'Vote' and confirm your choice.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>🔒 Security Measures</h2>
            <p>
              We ensure top-tier security using end-to-end encryption, multi-factor authentication, and blockchain verification to protect vote integrity and voter anonymity.
            </p>
          </section>
        </>
      ) : (
        <p className={styles.loading}>No election data available.</p>
      )}
    </div>
  );
};

export default ElectionInfo;
