import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



// Auth Components
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";

// Admin Components
import AdminDashboard from "./Admin/AdminDashboard";
import CreateVote from "./Admin/CreateVote";
import VoteList from "./Admin/VoteList";
import UsersList from "./Admin/UsersList";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-vote" element={<CreateVote />} />
        <Route path="/admin/vote-lists" element={<VoteList />} />
        <Route path="/admin/users" element={<UsersList />} />

        {/* Logout Placeholder */}
        <Route path="/logout" element={<h2>Logging Out...</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
