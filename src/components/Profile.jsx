import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import Nav from './nav/Nav';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePic || "/default-avatar.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preference, setPreference] = useState(user?.preference || '');
  const navigate = useNavigate();

  const [paperTitle, setPaperTitle] = useState('');
  const [paperFile, setPaperFile] = useState(null);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (selectedFile) formData.append("profilePic", selectedFile);
    formData.append("preference", preference);

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${user.email}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        login(data.user);
      } else {
        alert(data.msg || "Failed to update");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Something went wrong");
    }
  };

  const handlePaperUpload = async (e) => {
    e.preventDefault();
    if (!paperFile || !paperTitle) {
      alert("Please fill in all paper fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", paperTitle);
    formData.append("paper", paperFile);
    formData.append("uploader", user.name);

    try {
      const res = await fetch("http://localhost:5000/api/upload-paper", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Paper uploaded successfully!");
        setPaperTitle('');
        setPaperFile(null);
      } else {
        alert(data.msg || "Upload failed.");
      }
    } catch (err) {
      console.error("Paper upload failed", err);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // ------------------ ADMIN PANEL ------------------
  if (user?.userType === "admin") {
    return (
      <>
      <Nav />
      <div className="profile-container">
        <div className="profile-card">
          <h2 style={{fontWeight:"800",fontFamily:"Agency FB",fontSize:"1.9rem"}}>Welcome Back Admin {user.name}</h2>
          <br></br>
          <div className="profile-pic-section">
            <img src={profilePic} alt="Admin Profile" className="profile-pic" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="file" accept="image/*" onChange={handlePicChange} />
            <button onClick={handleSave} className="save-btn" style={{ marginTop: "10px" }}>
              Save Profile Picture
            </button>
          </div>

          <div className="admin-controls">
            <NavLink to="/UploadBook"><button className="upload-btn">
              ➕ Upload Book or Audiobook
            </button></NavLink>
            <NavLink to="/DeleteBook"><button className="upload-btn">
              ❌ Delete Existing Book
            </button></NavLink>
            <NavLink to="/ManageUsers"><button className="upload-btn">
              👥 Manage Users
            </button></NavLink>
            <button className="upload-btn" onClick={handleLogout}>
              🔓 Logout
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ------------------ NORMAL USER PANEL ------------------
  return (
    <>
      <Nav />
      <div className="profile-container">
        <div className="profile-card">
          <h2>Your Profile</h2>

          <div className="profile-pic-section">
            <img src={profilePic} alt="Profile" className="profile-pic" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="file" accept="image/*" onChange={handlePicChange} />
          </div>

          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name || '—'}</p>
            <p><strong>Email:</strong> {user?.email || '—'}</p>
            <p><strong>Institution:</strong> {user?.institution || '—'}</p>
            <p><strong>User Type:</strong> {user?.userType || '—'}</p>

            <label><strong>Preferred Book Category:</strong></label>
            <select value={preference} onChange={(e) => setPreference(e.target.value)}>
              <option value="">Select one</option>
              <option value="programming">Programming</option>
              <option value="fiction">Fiction</option>
              <option value="science">Science</option>
              <option value="math">Math</option>
              <option value="history">History</option>
              <option value="biography">Biography</option>
              <option value="art">Art</option>
              <option value="philosophy">Philosophy</option>
            </select>

            <button className="save-btn" onClick={handleSave}>Save Preferences</button>
          </div>

          {(user?.userType === 'teacher' || user?.userType === 'researcher') && (
            <div className="upload-paper-section">
              <h3>Upload Research Paper</h3>
              <form onSubmit={handlePaperUpload} className="upload-form">
                <label>
                  Paper Title:
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Upload PDF:
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPaperFile(e.target.files[0])}
                    required
                  />
                </label>
                <button type="submit" className="upload-btn">Upload Paper</button>
              </form>
            </div>
          )}

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button onClick={handleLogout} className="upload-btn">Logout</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
