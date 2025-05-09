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
          setPoll(data[0]);
          setCandidates(data[0].options || []);
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
      <div className={styles.heading}>
        <img src="/Logo2.png" alt="Election Logo" />
        <h1 className={styles.title}>Election Information</h1>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading election data...</p>
      ) : poll ? (
        <>
          <section className={styles.section}>
            <h2>🗳 {poll.title}</h2>
            <p>{poll.description}</p>
            <p><strong>📍 Location:</strong> {poll.address}</p>
            <p><strong>📡 Status:</strong> {poll.status.toUpperCase()}</p>
          </section>

          <section className={styles.section}>
            <h2>📅 Important Dates</h2>
            <ul>
              <li>📝 Registration Closes: April 15, 2025</li>
              <li>🗳️ Voting Opens: April 20, 2025</li>
              <li>🕔 Voting Closes: April 25, 2025</li>
              <li>📢 Results Announcement: April 30, 2025</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2><IoPeopleSharp /> Meet the Candidates</h2>
            <div className={styles.candidateList}>
              {candidates.length === 0 ? (
                <p>No candidates available.</p>
              ) : (
                candidates.map((candidate, index) => (
                  <div key={index} className={styles.candidateCard}>
                    <img
                      src={candidate.image || "/default-candidate.png"}
                      alt={candidate.name}
                      className={styles.candidateImg}
                    />
                    <h3>{candidate.name}</h3>
                    <p><strong>Votes:</strong> {candidate.votes}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>✅ How to Vote</h2>
            <ol>
              <li>Register before April 15, 2025.</li>
              <li>Login and select your preferred candidate.</li>
              <li>Submit your vote securely and confirm submission.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>🔒 Security Measures</h2>
            <p>
              All votes are encrypted and verified using multi-factor authentication.
              We ensure confidentiality and integrity in every vote cast.
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
