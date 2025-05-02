import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import './Auth.css';
import logoImage from '../../assets/Logo2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = { email, password };

    try {
      const response = await axios.post('http://localhost:3333/api/users/login', userData);

      console.log('User Logged In:', response.data);

      const { accessToken, fullName, email: userEmail, role } = response.data;

      if (accessToken) {
        // Store user data
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userName", fullName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("role", role); 

        // Redirect based on role
        if (role === "admin") {
          navigate('/admin');
        } else {
          navigate('/userDashboard');
        }
      } else {
        setError('Invalid login. No token returned.');
      }
    } catch (err) {
      console.error('Error logging in:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
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
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
