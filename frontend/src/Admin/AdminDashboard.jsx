import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Only Admin Dashboard shows this */}
      <div className="admin-header">
        <h1 className="admin-logo">E-मत</h1>
        <h2 className="admin-title">Admin Panel</h2>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="admin-cards">
        {/* Create Vote */}
        <div className="admin-card" onClick={() => navigate("/admin/create-vote")}>
          <h2 className="admin-card-title pink">
            <i className="fas fa-plus-circle"></i> Create Vote
          </h2>
          <p className="admin-card-text">Add new polls for users to vote on.</p>
          <button className="admin-button pink-btn">
            <i className="fas fa-pen-nib"></i> Go to Create Vote
          </button>
        </div>

        {/* Users List */}
        <div className="admin-card" onClick={() => navigate("/admin/users")}>
          <h2 className="admin-card-title purple">
            <i className="fas fa-users"></i> Users List
          </h2>
          <p className="admin-card-text">View and manage all registered users.</p>
          <button className="admin-button purple-btn">
            <i className="fas fa-user-cog"></i> Go to Users List
          </button>
        </div>

        {/* Vote Lists */}
        <div className="admin-card" onClick={() => navigate("/admin/vote-lists")}>
          <h2 className="admin-card-title indigo">
            <i className="fas fa-list-ul"></i> Vote Lists
          </h2>
          <p className="admin-card-text">Manage polls and check results.</p>
          <button className="admin-button indigo-btn">
            <i className="fas fa-chart-bar"></i> Go to Vote Lists
          </button>
        </div>

        {/* Analytics */}
        <div className="admin-card" onClick={() => navigate("/admin/analytics")}>
          <h2 className="admin-card-title teal">
            <i className="fas fa-chart-line"></i> Analytics
          </h2>
          <p className="admin-card-text">View real-time vote charts and trends.</p>
          <button className="admin-button teal-btn">
            <i className="fas fa-poll"></i> Go to Analytics
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
