import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import logoImage from '../../assets/Logo2.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:3333/users/forgot-password', { email });
      setMessage(response.data.message || 'Check your email for the reset link.');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container no-divider">
      <div className="left-side">
        <div className="left-top-title">
          <h1 className="emat-title">E-मत</h1>
        </div>
        <img src={logoImage} alt="Voting Logo" className="auth-logo" />
        <div className="left-message">
          <h1>Reset Password</h1>
          <p>We’ll send you instructions to reset your password.</p>
        </div>
      </div>

      <div className="right-side">
        <div className="login-card">
          <h2>Forgot Password</h2>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p><a href="/login">Back to Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
