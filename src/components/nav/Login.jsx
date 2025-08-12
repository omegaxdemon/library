import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { NavLink, useNavigate } from 'react-router-dom';
import './log.css';
import { useAuth } from '../../AuthContext';
import Spinner from '../Spinner'; // ✅ Import Spinner

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ Loader state

  useEffect(() => {
    if (user) navigate("/Profile");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loader

    try {
      const res = await fetch("https://library-backend-fwfr.onrender.com/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        login(data.user);
        navigate("/Profile");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <>
      <Nav />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In to Your Account</h2>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Security Question</label>
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select a security question</option>
            <option value="pet">What is your pet's name?</option>
            <option value="school">What is your first school?</option>
            <option value="city">Which city were you born in?</option>
          </select>

          <label>Your Answer</label>
          <input
            type="text"
            name="securityAnswer"
            placeholder="Enter your answer"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
            disabled={loading}
          />

          {loading ? <Spinner /> : (
            <button type="submit" disabled={loading}>Sign In</button>
          )}

          <p className="signup-link">
            Don’t have an account? <NavLink to='/Sign'>Create one</NavLink>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
