import React, { useEffect, useState } from "react";
import styles from "../Styles/VotingComponent.module.css";
import logo from "/Logo2.png";

const VotingComponent = () => {
  // State variables
  const [activePolls, setActivePolls] = useState([]); // Stores active polls
  const [selectedVotes, setSelectedVotes] = useState({}); // Stores the selected candidate for each poll
  const [hasVoted, setHasVoted] = useState({}); // Keeps track of whether the user has voted in each poll
  const [error, setError] = useState(null); // Stores error messages
  const [successMessage, setSuccessMessage] = useState(""); // Stores success messages
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Fetch active polls when the component is mounted
  useEffect(() => {
    fetchActivePolls();
  }, []);

  // Function to fetch active polls from the server
  const fetchActivePolls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/polls", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched polls:", data);

      // Filter only active polls
      const active = data.filter(
        (poll) => poll.status && poll.status.toLowerCase() === "active"
      );
      setActivePolls(active);

      // Check if the user has already voted for any poll
      const votedPolls = {};
      active.forEach((poll) => {
        if (poll.options.some((option) => option.voters.includes(token))) {
          votedPolls[poll._id] = true; // Mark as voted
        }
      });
      setHasVoted(votedPolls);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to fetch polls.");
      setLoading(false);
    }
  };

  // Function to handle selection of candidate in a poll
  const handleVoteChange = (pollId, candidateId) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [pollId]: candidateId,
    }));
  };

  // Function to handle the submission of a vote
  const handleVoteSubmit = async (pollId) => {
    const candidateId = selectedVotes[pollId];
    if (!candidateId) {
      setError("Please select a candidate before submitting your vote.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/polls/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pollId, optionId: candidateId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Vote submission failed.");
        setLoading(false);
        return;
      }

      // After successful vote, mark this poll as voted
      setHasVoted((prev) => ({
        ...prev,
        [pollId]: true,
      }));
      setSuccessMessage(`Your vote for poll "${pollId}" has been submitted!`);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError("Failed to submit vote. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Logo and header */}
        <img src={logo} alt="Election Logo" className={styles.logo} />
        <h1>Active Elections</h1>
        <p className={styles.description}>
          Vote for the candidates who best represent your views.
        </p>
      </header>

      {/* Loading state */}
      {loading && <p>Loading polls...</p>}

      {/* Display error message if there was an issue */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Display success message after successful vote */}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {/* If no active polls, show this message */}
      {activePolls.length === 0 && !loading && (
        <p>No active elections available at the moment.</p>
      )}

      {/* Map over active polls and display each poll */}
      {activePolls.map((poll) => (
        <div key={poll._id} className={styles.electionCard}>
          <h2>{poll.title}</h2>
          <p>{poll.description}</p>
          <p>
            <strong>Address:</strong> {poll.address}
          </p>

          {/* Render candidates (options) */}
          {poll.options && poll.options.length > 0 ? (
            !hasVoted[poll._id] ? (
              // If the user hasn't voted, show options for voting
              <form className={styles.form}>
                {poll.options.map((candidate) => (
                  <label key={candidate._id} className={styles.candidateCard}>
                    <input
                      type="radio"
                      name={`poll-${poll._id}`}
                      value={candidate._id}
                      onChange={() => handleVoteChange(poll._id, candidate._id)}
                      checked={selectedVotes[poll._id] === candidate._id}
                      className={styles.radioButton}
                    />
                    <div className={styles.candidateInfo}>
                      <h3>{candidate.name}</h3>
                      {candidate.imageUrl && (
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className={styles.candidateImage}
                        />
                      )}
                      {/* Display candidate's platform (if available) */}
                      {candidate.platform && candidate.platform.length > 0 && (
                        <ul className={styles.platform}>
                          {candidate.platform.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={() => handleVoteSubmit(poll._id)}
                >
                  Submit Vote
                </button>
              </form>
            ) : (
              // If the user has already voted, show a thank you message
              <div className={styles.votedMessage}>
                Thank you! Your vote has been submitted.
              </div>
            )
          ) : (
            <p>No candidates available for this poll.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default VotingComponent;
