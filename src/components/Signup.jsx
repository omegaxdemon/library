import React, { useState } from 'react';
import './signup.css';
import { NavLink } from 'react-router-dom';
import Nav from './nav/Nav';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    userType: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email.");
        setOtpSent(true);
      } else {
        alert(data.msg || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      alert("Something went wrong.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp: otpInput }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        console.log("Created user:", data.user);
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
  };

  return (
    <>
      <Nav />
      <div className="signup-container">
        <form className="signup-form" onSubmit={otpSent ? handleSignup : sendOTP}>
          <h2>Create an Account</h2>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={otpSent}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={otpSent}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={otpSent}
          />

          <label>Institution Name</label>
          <input
            type="text"
            name="institution"
            placeholder="Enter your institution name"
            value={formData.institution}
            onChange={handleChange}
            required
            disabled={otpSent}
          />

          <label>Type of User</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            disabled={otpSent}
          >
            <option value="">Select user type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="researcher">Researcher</option>
          </select>

          <label>Security Question</label>
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
            disabled={otpSent}
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
            disabled={otpSent}
          />

          {otpSent && (
            <>
              <label>Enter OTP sent to your email</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit">{otpSent ? "Verify OTP & Register" : "Send OTP"}</button>

          <p className="signin-text">
            Already have an account? <NavLink to="/Log">Sign in</NavLink>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;