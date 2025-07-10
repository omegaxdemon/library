import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./nav.css";
import Logo from "./logowhite";
import { useAuth } from "../../AuthContext";

const Nav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/Profile");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid" id="major">
        {/* Logo & Title */}
        <NavLink className="navbar-brand d-flex align-items-center text-white" to="/">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Logo />
          <span className="ms-2 fw-bold" style={{ fontSize: "1.5rem" }}>Digital Library</span>
        </NavLink>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler bg-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Main Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links">

            <li className="nav-item">
              <NavLink to="/" className="nav-link nav-link-custom">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Browse" className="nav-link nav-link-custom">Browse</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/About" className="nav-link nav-link-custom">About Us</NavLink>
            </li>

            {/* Auth Conditional Section */}
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/Sign">
                    <button className="but">Sign Up</button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Log">
                    <button className="but">Sign In</button>
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  onClick={handleProfileClick}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    marginRight: "10px",
                    objectFit: "cover"
                  }}
                />
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
