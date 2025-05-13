import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import logoImage from '../../assets/Logo2.png';

const Signup = () => {
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // National ID format: XX-XX-XX-XXXXX
    const nationalIdRegex = /^\d{2}-\d{2}-\d{2}-\d{5}$/;
    if (!nationalIdRegex.test(nationalID)) {
      setError('National ID must be in the format XX-XX-XX-XXXXX.');
      return;
    }

    // Age validation: Must be at least 18 years old
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      setError('You must be at least 18 years old to sign up.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedUserData = {
      fullName: `${fullName.firstName} ${fullName.lastName}`,
      email,
      password,
      gender,
      dateOfBirth: dob,
      phone,
      address: province,
      nationalID
    };

    try {
      const response = await axios.post('http://localhost:3333/users/register', formattedUserData);

      console.log('Signup successful:\n', JSON.stringify(response.data, null, 2));

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        alert('Registration successful!');
        navigate('/userDashboard');
      } else if (response.data.error) {
        setError(response.data.error);
      } else {
        setError('Unexpected response. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'There was an error signing up. Please try again later.');
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
          <h1>Let Your Voice Be Heard</h1>
          <p>Register today and shape the future.</p>
        </div>
      </div>

      <div className="right-side">
        <div className="signup-card">
          <h2>Create Account</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <div className="name-inputs">
                <input
                  type="text"
                  placeholder="First Name"
                  value={fullName.firstName}
                  onChange={(e) => setFullName({ ...fullName, firstName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={fullName.lastName}
                  onChange={(e) => setFullName({ ...fullName, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,10}$/.test(input)) {
                    setPhone(input);
                  }
                }}
                required
              />
            </div>

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

            <div className="input-group">
              <i className="fas fa-calendar-alt"></i>
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fas fa-venus-mars"></i>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group city-group">
              <i className="fas fa-map-marker-alt"></i>
              <select value={province} onChange={(e) => setProvince(e.target.value)} required>
                <option value="">Select Province</option>
                {nepaliProvinces.map((provinceOption, index) => (
                  <option key={index} value={provinceOption}>{provinceOption}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <i className="fas fa-id-card"></i>
              <input
                type="text"
                placeholder="National ID (XX-XX-XX-XXXXX)"
                value={nationalID}
                onChange={(e) => setNationalID(e.target.value)}
                required
              />
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label>I agree to the terms of service and privacy policy</label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
