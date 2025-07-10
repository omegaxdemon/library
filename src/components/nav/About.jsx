import React from 'react';
import Nav from './Nav';
import './About.css';

const About = () => {
  const team = [
    {
      name: 'Debottam Chatterjee',
      role: 'Web Developer & Video Editor',
      desc: 'A passionate web development enthusiast who loves building digital experiences. Skilled in React, and also enjoys editing cinematic videos in his free time.',
      email: 'debottam2004@gmail.com',
      phone: '+91-87776-75501',
      link: 'https://www.linkedin.com/in/debottam0812'
    },
    {
      name: 'Rajdip Roy',
      role: 'Developer & Maker',
      desc: 'Enjoys solving real-world problems through code. Has a builder mindset and always looks for opportunities to innovate and create.',
      email: 'rroy05022004@gmail.com',
      phone: '+91-76024-21580',
      link:'https://www.linkedin.com/in/rajdip-roy-336a24284/'
    },
    {
      name: 'Shuvam Bhattacharya',
      role: 'Competitive Programmer',
      desc: 'An active coder with a sharp focus on algorithms and data structures. Loves competitive programming and backend logic design.',
      email: 's8947211@gmail.com',
      phone: '+91-89811-09323',
      link:'https://www.linkedin.com/in/shuvam-bhattacharya-80657b359/'
    },
  ];

  return (
    <>
    <Nav/>
    <div className="about-container">
      <h1 className="about-title">About Our Project</h1>
      <p className="about-description">
        We are three final-year Computer Science students from St. Xavier’s College, Kolkata, working on this platform to help students, researchers, and teachers manage their PDFs, audiobooks, and research materials — all in one place, securely under their profiles.
      </p>

      <div className="team-grid">
        {team.map((member, index) => (
          <div className="card" key={index}>
            <h2>{member.name}</h2>
            <h4>{member.role}</h4>
            <p>{member.desc}</p>
            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Phone:</strong> {member.phone}</p>
            <a href={member.link} target='_blank'><button className="linkedin-btn">Linkedin Profile</button></a>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default About;
