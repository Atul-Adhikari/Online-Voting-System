import React, { useEffect, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import styles from "../Styles/ElectionInfo.module.css";

const ElectionInfo = () => {
  // State to hold the current poll details
  const [poll, setPoll] = useState(null);
  // State to hold the list of candidates
  const [candidates, setCandidates] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch poll data from the backend API
    const fetchPollData = async () => {
      const token = localStorage.getItem("token");
      const userAddress = localStorage.getItem("address");

      // Ensure required data exists in localStorage
      if (!token || !userAddress) {
        console.error("Missing token or user address in localStorage.");
        setLoading(false);
        return;
      }

      try {
        // Make a request to fetch all polls
        const res = await fetch("http://localhost:3333/polls", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Check if the response contains polls
        if (Array.isArray(data) && data.length > 0) {
          // Find a poll that matches the user's province (case-insensitive)
          const matchingPoll = data.find(
            (poll) =>
              poll.address.trim().toLowerCase() ===
              userAddress.trim().toLowerCase()
          );

          // Set poll and candidate data if a match is found
          if (matchingPoll) {
            setPoll(matchingPoll);
            setCandidates(matchingPoll.options || []);
          } else {
            console.warn("No poll found for the user's province.");
          }
        }
      } catch (error) {
        // Log any error during fetch
        console.error("Error fetching data:", error);
      } finally {
        // Stop the loading spinner regardless of outcome
        setLoading(false);
      }
    };

    // Call the fetch function when component mounts
    fetchPollData();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <img src="/Logo2.png" alt="Election Commission Logo" />
        <h1>General Election 2025</h1>
      </div>

      {/* Conditional loading indicator */}
      {loading ? (
        <p className={styles.loading}>Loading election details...</p>
      ) : (
        <>
          {/* Show poll details if a matching poll is found */}
          {poll ? (
            <>
              {/* Poll Basic Information Section */}
              <section className={styles.section}>
                <h2>📜 {poll.title}</h2>
                <p>{poll.description}</p>
                <div className={styles.meta}>
                  <span>📍 Province: {poll.address}</span>
                  <span
                    className={`${styles.status} ${
                      poll.status === "active" ? styles.active : styles.inactive
                    }`}
                  >
                    {poll.status.toUpperCase()}
                  </span>
                </div>
              </section>

              {/* Summary Details Section */}
              <section className={styles.section}>
                <h2>📋 Election Summary</h2>
                <ul className={styles.summaryList}>
                  <li>
                    <strong>Election Title:</strong> {poll.title}
                  </li>
                  <li>
                    <strong>Location:</strong> {poll.address}
                  </li>
                  <li>
                    <strong>Status:</strong>{" "}
                    {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                  </li>
                  <li>
                    <strong>Total Registered Candidates:</strong>{" "}
                    {candidates.length}
                  </li>
                  <li>
                    <strong>Leading Candidate:</strong>{" "}
                    {candidates.length > 0
                      ? candidates.reduce((prev, current) =>
                          prev.votes > current.votes ? prev : current
                        ).name
                      : "No candidates"}
                  </li>
                </ul>
              </section>

              {/* Candidate Details Section */}
              <section className={styles.section}>
                <h2>
                  <IoPeopleSharp /> Meet the Candidates
                </h2>
                <div className={styles.candidatesGrid}>
                  {candidates.length === 0 ? (
                    <p>No candidates registered yet.</p>
                  ) : (
                    candidates.map((candidate, index) => (
                      <div key={index} className={styles.card}>
                        <img
                          src={candidate.imageUrl || "/default-candidate.png"}
                          alt={candidate.name}
                          className={styles.avatar}
                        />
                        <h3>{candidate.name}</h3>
                        {candidate.party && (
                          <p className={styles.party}>
                            Party: {candidate.party}
                          </p>
                        )}
                        <p>
                          <strong>Votes Received:</strong> {candidate.votes}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          ) : (
            // Message displayed if no poll is found for user's address
            <section className={styles.section}>
              <p className={styles.loading}>
                ❌ No active election found for your province.
              </p>
            </section>
          )}

          {/* Static Guidelines Section */}
          <section className={styles.section}>
            <h2>🧾 Voting Guidelines</h2>
            <ol className={styles.instructions}>
              <li>Ensure you're registered with a valid citizenship number.</li>
              <li>Login on the election day using your secure credentials.</li>
              <li>Select your preferred candidate and submit your vote.</li>
              <li>Once submitted, your vote is final and encrypted.</li>
            </ol>
          </section>

          {/* Static Security Info Section */}
          <section className={styles.section}>
            <h2>🔐 Election Security</h2>
            <p>
              Our system ensures voter privacy and vote integrity using
              state-of-the-art security including: secure authentication, and
              end-to-end encrypted vote submission. All activities are audited
              for transparency.
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default ElectionInfo;
