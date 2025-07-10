import React from 'react';
import './terms.css';
import Nav from './nav/Nav';

const Terms = () => {
  return (
    <>
    <Nav/>
    <div className="terms-container">
      <h1 className="terms-title">Terms of Service</h1>
      <p className="terms-date">Last updated: July 8, 2025</p>

      <section className="terms-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using our e-Library platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please refrain from using the service.
        </p>
      </section>

      <section className="terms-section">
        <h2>2. Use of Service</h2>
        <p>
          The e-Library is provided for educational and personal use only. You may not redistribute, resell, or exploit any content or services without explicit permission.
        </p>
      </section>

      <section className="terms-section">
        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
        </p>
      </section>

      <section className="terms-section">
        <h2>4. Intellectual Property</h2>
        <p>
          All content on this site, including books, graphics, and logos, is the property of the e-Library team or its content providers. Unauthorized use is prohibited.
        </p>
      </section>

      <section className="terms-section">
        <h2>5. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be posted on this page with the updated date.
        </p>
      </section>

      <section className="terms-section">
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:codespartanssxc@gmail.com">codespartanssxc@gmail.com</a>.
        </p>
      </section>
    </div></>
  );
};

export default Terms;
