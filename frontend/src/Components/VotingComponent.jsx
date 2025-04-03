import React, { useState } from "react";
import styles from "../Styles/VotingComponent.module.css";
import logo from "/Logo2.png";

const CANDIDATES = [
  {
    id: 1,
    name: "Harry Bhandari",
    party: "Progressive Alliance",
    age: 42,
    background: "Former City Council Member",
    image: "/Personal.jpg",
    platform: [
      "Improve Education Funding",
      "Healthcare Reform",
      "Green Energy Investment",
    ],
  },
  {
    id: 2,
    name: "John Pandey",
    party: "Economic Growth Party",
    age: 55,
    background: "Successful Entrepreneur",
    image: "/Logo2.png",
    platform: [
      "Small Business Support",
      "Tax Reduction",
      "Infrastructure Development",
    ],
  },
  {
    id: 3,
    name: "Fredrick Chalise",
    party: "Community First Coalition",
    age: 38,
    background: "Civil Rights Lawyer",
    image: "/Logo2.png",
    platform: [
      "Social Justice Reforms",
      "Community Empowerment",
      "Affordable Housing",
    ],
  },
  {
    id: 4,
    name: "Aisha Patel",
    party: "Community First Coalition",
    age: 38,
    background: "Civil Rights Lawyer",
    image: "/Logo2.png",
    platform: [
      "Social Justice Reforms",
      "Community Empowerment",
      "Affordable Housing",
    ],
  },
];

const VotingComponent = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStatus, setVotingStatus] = useState({
    submitted: false,
    error: null,
  });
  const [votedCandidateId, setVotedCandidateId] = useState(null); // Track voted candidate

  const handleCandidateSelect = (candidate) => {
    if (!votingStatus.submitted && votedCandidateId === null) {
      setSelectedCandidate(candidate);
    }
  };

  const submitVote = (candidateId) => {
    if (!selectedCandidate) {
      setVotingStatus({
        submitted: false,
        error: "Please select a candidate before voting.",
      });
      return;
    }

    try {
      setVotedCandidateId(candidateId); // Set voted candidate
      setVotingStatus({
        submitted: true,
        error: null,
      });
    } catch (error) {
      setVotingStatus({
        submitted: false,
        error: "Vote submission failed. Please try again.",
      });
    }
  };

  return (
    <div className={styles.votingContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <img
              src={logo}
              alt="Election Logo"
              className={styles.electionLogo}
            />
          </div>
          <div className={styles.headerText}>
            <h1>Official Candidate Selection Election</h1>
            <p>Choose your representative wisely</p>
          </div>
        </div>
      </header>

      {votingStatus.error && (
        <div className={styles.errorMessage}>{votingStatus.error}</div>
      )}

      {votingStatus.submitted && (
        <div className={styles.successMessage}>
          Your vote has been successfully submitted. Thank you for participating
          in the democratic process.
        </div>
      )}

      <div className={styles.candidateGrid}>
        {CANDIDATES.map((candidate) => (
          <div
            key={candidate.id}
            className={`${styles.candidateCard} ${
              selectedCandidate?.id === candidate.id ? styles.selected : ""
            } ${votingStatus.submitted ? styles.disabled : ""}`}
            onClick={() => handleCandidateSelect(candidate)}
          >
            <div className={styles.candidateHeader}>
              <img
                src={candidate.image}
                alt={candidate.name}
                className={styles.candidateImage}
              />
              <div className={styles.candidateInfo}>
                <h2>{candidate.name}</h2>
                <p>{candidate.party}</p>
              </div>
            </div>

            <div className={styles.candidateDetails}>
              <div className={styles.detailSection}>
                <span>Age:</span> {candidate.age}
              </div>
              <div className={styles.detailSection}>
                <span>Background:</span> {candidate.background}
              </div>

              <div className={styles.platformSection}>
                <h3>Key Platform Points:</h3>
                <ul>
                  {candidate.platform.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.votingActions}>
              <button
                className={`${styles.voteButton} ${
                  votedCandidateId === candidate.id || votingStatus.submitted
                    ? styles.disabledButton
                    : ""
                }`}
                onClick={() => submitVote(candidate.id)}
                disabled={
                  votedCandidateId === candidate.id || votingStatus.submitted
                }
              >
                {votedCandidateId === candidate.id
                  ? "Vote Submitted"
                  : "Cast Your Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingComponent;
