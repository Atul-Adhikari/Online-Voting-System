import React from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="analytics-wrapper">
      {/* Back to Dashboard Button */}
      <button className="back-button" onClick={() => navigate("/admin")}>
        ← Back to Dashboard
      </button>

      {/* Page Heading */}
      <h1 className="analytics-heading">📊 Analytics Dashboard</h1>
      <p className="analytics-subtext">Explore real-time vote charts and trends below.</p>

      {/* Chart Cards */}
      <div className="admin-cards">
        <div className="admin-card">
          <h2 className="admin-card-title pink">
            <i className="fas fa-chart-bar"></i> Votes per Poll
          </h2>
          <p className="admin-card-text">Compare total votes received by each poll.</p>
          <button
            className="admin-button pink-btn"
            onClick={() => navigate("/admin/analytics/votes-per-poll")}
          >
            <i className="fas fa-chart-column"></i> View Chart
          </button>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title purple">
            <i className="fas fa-pie-chart"></i> Option Breakdown
          </h2>
          <p className="admin-card-text">See how votes are distributed among options.</p>
          <button
            className="admin-button purple-btn"
            onClick={() => navigate("/admin/analytics/option-breakdown")}
          >
            <i className="fas fa-chart-pie"></i> View Chart
          </button>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title indigo">
            <i className="fas fa-clock"></i> Votes Over Time
          </h2>
          <p className="admin-card-text">Track when users are most active.</p>
          <button
            className="admin-button indigo-btn"
            onClick={() => navigate("/admin/analytics/votes-over-time")}
          >
            <i className="fas fa-clock-rotate-left"></i> View Chart
          </button>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title teal">
            <i className="fas fa-map-marker-alt"></i> Votes by Province
          </h2>
          <p className="admin-card-text">Visualize voter activity by region.</p>
          <button
            className="admin-button teal-btn"
            onClick={() => navigate("/admin/analytics/votes-by-province")}
          >
            <i className="fas fa-globe-asia"></i> View Chart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
