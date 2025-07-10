import React from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import Log from './components/nav/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import About from './components/nav/About';
import HomePage from './components/nav/HomePage';
import Browse from './components/Browse';
import Profile from './components/Profile';
import ReadBook from './components/ReadBook'; 
import { AuthProvider } from './AuthContext';
import HearBook from "./components/HearBook";
import Terms from './components/Terms'; 
import Policy from './components/Policy'; 
import UploadBook from './components/admin/UploadBook';
import DeleteBook from './components/admin/DeleteBook';
import ManageUsers from './components/admin/ManageUsers';
import Spinner from './components/Spinner'; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Nav /><HomePage /></>} />
          <Route path="/Log" element={<Log />} />
          <Route path="/Sign" element={<Signup />} />
          <Route path="/About" element={<About />} />
          <Route path="/Browse" element={<Browse />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Read/:bookId" element={<ReadBook />} />
          <Route path="/Hear/:bookId" element={<HearBook />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Policy" element={<Policy />} />
          <Route path="/UploadBook" element={<UploadBook />} />
          <Route path="/DeleteBook" element={<DeleteBook />} />
          <Route path="/ManageUsers" element={<ManageUsers />} />
          <Route path="/Spinner" element={<Spinner />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
