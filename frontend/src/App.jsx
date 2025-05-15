import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Authentication and User Components
import SplashPage from "./Components/SplashPage";
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword";
import LogoutMessage from "./Components/LogoutMesssage";
import UserDashboard from "./Components/UserDashboard";

// Admin Pages
import AdminDashboard from "./Admin/AdminDashboard";
import CreateVote from "./Admin/CreateVote";
import VoteList from "./Admin/VoteList";
import UsersList from "./Admin/UsersList";
import Analytics from "./Admin/Analytics";
import AdminLayout from "./Admin/AdminLayout";

// Charts
import VotePerPollChart from "./charts/VotePerPollChart";
import OptionBreakdownChart from "./charts/OptionBreakdownChart";
import VotesOverTime from "./charts/VotesOverTime";
import VoteByProvinceChart from "./charts/VoteByProvinceChart";

const AppRoutes = () => {
  const { auth } = useContext(AuthContext);
  const token = auth.token;
  const role = auth.role;

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return token && role === "admin" ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={
          token ? (role === "admin" ? <Navigate to="/admin" /> : <UserDashboard />) : <SplashPage />
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/logout" element={<LogoutMessage />} />
      <Route path="/userDashboard/*" element={token ? <UserDashboard /> : <Login />} />


      {/* User Dashboard */}
      <Route
        path="/userDashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes with Nested Layout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="create-vote" element={<CreateVote />} />
        <Route path="vote-lists" element={<VoteList />} />
        <Route path="users" element={<UsersList />} />
        <Route path="analytics" element={<Analytics />} />

        {/* Chart Routes */}
        <Route path="analytics/votes-per-poll" element={<VotePerPollChart />} />
        <Route path="analytics/option-breakdown" element={<OptionBreakdownChart />} />
        <Route path="analytics/votes-over-time" element={<VotesOverTime />} />
        <Route path="analytics/votes-by-province" element={<VoteByProvinceChart />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
