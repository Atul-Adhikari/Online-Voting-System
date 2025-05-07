import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Splash Page
import SplashPage from "./Components/SplashPage";

// Auth Components
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import LogoutMessage from "./Components/LogoutMesssage";

// Admin Components
import AdminDashboard from "./Admin/AdminDashboard";
import CreateVote from "./Admin/CreateVote";
import VoteList from "./Admin/VoteList";
import UsersList from "./Admin/UsersList";

// User Components
import UserDashboard from "./Components/UserDashboard";

function App() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          role === "admin" ? <AdminDashboard /> :
          token ? <UserDashboard /> :
          <SplashPage />
        } />
        
        <Route path="/userDashboard" element={<UserDashboard/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<LogoutMessage />} />


        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDashboard/*" element={<UserDashboard />} />
        <Route path="/logout" element={<LogoutMessage/>} />


        {/* User Dashboard */}
        <Route path="/userDashboard/*" element={
          token ? <UserDashboard /> : <Login />
        } />


        {/* Admin Routes */}
        <Route path="/admin" element={
          role === "admin" ? <AdminDashboard /> : <Login />
        } />
        <Route path="/admin/create-vote" element={
          role === "admin" ? <CreateVote /> : <Login />
        } />
        <Route path="/admin/vote-lists" element={
          role === "admin" ? <VoteList /> : <Login />
        } />
        <Route path="/admin/users" element={
          role === "admin" ? <UsersList /> : <Login />
        } />
      </Routes>
    </Router>
  );
}

export default App;
