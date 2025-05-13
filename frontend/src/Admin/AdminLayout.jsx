import React from "react";
import { Outlet } from "react-router-dom";
import "./Admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-dashboard">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
