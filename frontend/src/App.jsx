import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import SplashPage from "./Components/SplashPage";
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import LogoutMessage from "./Components/LogoutMesssage";

import AdminDashboard from "./Admin/AdminDashboard";
import CreateVote from "./Admin/CreateVote";
import VoteList from "./Admin/VoteList";
import UsersList from "./Admin/UsersList";

import UserDashboard from "./Components/UserDashboard";

function App() {
  const { auth } = useContext(AuthContext);

  // Safely access token and role
  const token = auth?.token;
  const role = auth?.role;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          role === "admin" ? <AdminDashboard /> :
          token ? <UserDashboard /> :
          <SplashPage />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<LogoutMessage />} />

        <Route path="/userDashboard/*" element={token ? <UserDashboard /> : <Login />} />

        <Route path="/admin" element={role === "admin" ? <AdminDashboard /> : <Login />} />
        <Route path="/admin/create-vote" element={role === "admin" ? <CreateVote /> : <Login />} />
        <Route path="/admin/vote-lists" element={role === "admin" ? <VoteList /> : <Login />} />
        <Route path="/admin/users" element={role === "admin" ? <UsersList /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
