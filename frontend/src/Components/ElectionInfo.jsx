import React from "react";
import { IoPeopleSharp } from "react-icons/io5";
import styles from "../Styles/ElectionInfo.module.css";

const ElectionInfo = () => {
  const candidates = [
    {
      id: 1,
      name: "Harry Bhandari",
      party: "Progressive Alliance",
      age: 42,
      background: "Former City Council Member",
      img: "/Logo2.png",
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
      img: "/Logo2.png",
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
      img: "/Logo2.png",
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
      img: "/Logo2.png",
      platform: [
        "Social Justice Reforms",
        "Community Empowerment",
        "Affordable Housing",
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <img src="/Logo2.png" alt="" srcset="" />
        <h1 className={styles.title}>Election Information</h1>
      </div>

      <section className={styles.section}>
        <h2>🗳 Election Overview</h2>
        <p>
          Welcome to the 2025 National Elections. Participate in shaping the
          future.
        </p>
      </section>

      <section className={styles.section}>
        <h2>📅 Important Dates</h2>
        <ul>
          <li>Registration Closes: April 15, 2025</li>
          <li>Voting Opens: April 20, 2025</li>
          <li>Voting Closes: April 25, 2025</li>
          <li>Results Announcement: April 30, 2025</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>
          <IoPeopleSharp /> Candidates
        </h2>
        <div className={styles.candidateList}>
          {candidates.map((candidate, index) => (
            <div key={index} className={styles.candidateCard}>
              <img
                src={candidate.img}
                alt={candidate.name}
                className={styles.candidateImg}
              />
              <h3>{candidate.name}</h3>
              <p>
                <strong>Party:</strong> {candidate.party}
              </p>
              <p>{candidate.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>✅ How to Vote</h2>
        <p>1. Register before April 15, 2025.</p>
        <p>2. Login to your account and select your preferred candidate.</p>
        <p>3. Submit your vote securely.</p>
      </section>

      <section className={styles.section}>
        <h2>🔒 Security Measures</h2>
        <p>
          Your vote is secured with end-to-end encryption and multi-factor
          authentication.
        </p>
      </section>
    </div>
  );
};

export default ElectionInfo;
