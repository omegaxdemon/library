import React from "react";
import Nav from "./nav/Nav"; // Keep your existing navbar
import "./PrivacyPolicy.css";
import { NavLink } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <>
      <Nav />
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>

        <p>
          At <strong>Digital Library</strong>, we respect your privacy and are
          committed to protecting your personal information. This Privacy Policy
          outlines how we collect, use, and safeguard your data.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account Information:</strong> Name, email, institution, and user type during registration.</li>
          <li><strong>Usage Data:</strong> Book preferences, download activity, and interaction logs.</li>
          <li><strong>Uploaded Content:</strong> Research papers, profile picture, and any other user-submitted data.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide access to books and resources.</li>
          <li>To personalize your digital library experience.</li>
          <li>To enable teacher/researcher uploads and recommendations.</li>
          <li>To improve the platform using analytics.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no system is 100% secure.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell or share your personal information with third parties,
          except:
        </p>
        <ul>
          <li>To comply with legal obligations</li>
          <li>To enforce our terms and policies</li>
          <li>With trusted service providers under confidentiality agreements</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>You can request to:</p>
        <ul>
          <li>Access or update your profile data</li>
          <li>Delete your account permanently</li>
          <li>Opt-out of certain communications</li>
        </ul>

        <h2>6. Updates to This Policy</h2>
        <p>
          This Privacy Policy may be updated occasionally. Changes will be
          reflected on this page with a revised "last updated" date.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us. <br />
        <strong><NavLink to='/About' style={{color:'black',textDecoration:'None'}}>Visit our About Us Page</NavLink></strong>
        </p>

        <p className="last-updated"><em>Last updated: July 8, 2025</em></p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
