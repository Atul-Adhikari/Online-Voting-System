import React, { useEffect, useState } from "react";

const Result = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found.");
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
          throw new Error("Failed to fetch poll results.");
        }

        const data = await response.json();

        const filtered = data.filter(
          (poll) => poll.status === "inactive" && poll.isPublished
        );

        setResults(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load election results.");
      }
    };

    fetchResults();
  }, []);

  const containerStyle = {
    padding: "2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  };

  const descStyle = {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1rem",
  };

  const listItemStyle = {
    fontSize: "1rem",
    padding: "0.3rem 0",
  };

  const winnerStyle = {
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: "1rem",
    background: "#eafaf1",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    display: "inline-block",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#1e272e", marginBottom: "1.5rem" }}>📊 Election Results</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length === 0 && !error && (
        <p style={{ color: "#555" }}>No published results available.</p>
      )}

      {results.map((poll) => {
        const winner =
          poll.options &&
          poll.options.reduce((max, option) =>
            (option.votes || 0) > (max.votes || 0) ? option : max
          );

        return (
          <div key={poll._id} style={cardStyle}>
            <h3 style={titleStyle}>{poll.title}</h3>
            <p style={descStyle}>{poll.description}</p>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {poll.options.map((opt, idx) => (
                <li key={idx} style={listItemStyle}>
                  🔹 <strong>{opt.name}</strong> ({opt.party || "Independent"}):{" "}
                  <strong>{typeof opt.votes === "number" ? opt.votes : 0}</strong> votes
                </li>
              ))}
            </ul>
            {winner && (
              <div style={winnerStyle}>
                ✅ Winner: {winner.name} ({winner.party || "Independent"})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Result;
