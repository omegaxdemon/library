// src/components/Spinner.jsx
import React from 'react';
import './spinner.css';
import LogoIcon from './nav/logoicon'; // Make sure this exports an SVG component

const Spinner = () => {
  return (
    <div className="spinner-backdrop">
      <div className="spinner-logo">
        <LogoIcon />
      </div>
    </div>
  );
};

export default Spinner;
