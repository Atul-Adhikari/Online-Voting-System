import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import logoImage from '../../assets/Logo2.png';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!navigator.onLine) {
      setError("You're offline. Please check your internet connection.");
      setLoading(false);
      return;
    }

    const userData = { email, password };

    try {
      const response = await axios.post('http://localhost:3333/users/login', userData);
      const data = response.data;

      if (data.error) {
        const backendMsg = data.error.toLowerCase();
        if (backendMsg.includes("not verified")) {
          setError("Wait till the admin verifies your ID.");
        } else {
          setError("Invalid email or password.");
        }
        return;
      }

      const { accessToken, fullName, email: userEmail, role } = data;

      if (!accessToken) {
        setError("Invalid email or password.");
        return;
      }

      // Save user info in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("role", role);

      const profileRes = await axios.get('http://localhost:3333/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { gender, dateOfBirth, phone, address, nationalID } = profileRes.data;

      localStorage.setItem("gender", gender);
      localStorage.setItem("dob", dateOfBirth);
      localStorage.setItem("phone", phone);
      localStorage.setItem("address", address);
      localStorage.setItem("nationalID", nationalID);

      setAuth({ token: accessToken, role });

      if (role === "admin") {
        navigate('/admin');
      } else {
        navigate('/userDashboard');
      }
    } catch (err) {
      console.error('Error logging in:', err.response?.data || err.message);
      const backendMsg = err.response?.data?.error?.toLowerCase() || '';
      if (backendMsg.includes("not verified")) {
        setError("Wait till the admin verifies your ID.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="left-side">
        <div className="left-top-title">
          <h1 className="emat-title">E-मत</h1>
        </div>
        <img src={logoImage} alt="Voting Logo" className="auth-logo" />
        <div className="left-message">
          <h1>Welcome Back</h1>
          <p>Make your voice count. Choose a wise leader.</p>
        </div>
      </div>

      <div className="right-side">
        <div className="login-card">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group password-group">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
