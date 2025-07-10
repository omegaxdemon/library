import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Homepage.css';
import Logo from './logoicon';
import { IoMdDownload } from "react-icons/io";
import { FaCircleChevronRight } from "react-icons/fa6";
import LogW from './logowhite';
import LogoB from './logob';
import { IoBookSharp } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useAuth } from '../../AuthContext';
import Terms from '../Terms';
import Policy from '../Policy';
import Spinner from '../Spinner'; // ✅ Import spinner

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Spinner state
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books");
        const allBooks = await res.json();
        const latestBooks = allBooks.reverse().slice(0, 6);

        const booksWithDescriptions = await Promise.all(
          latestBooks.map(async (book) => {
            try {
              const searchRes = await fetch(
                `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`
              );
              const data = await searchRes.json();
              const matchedBook = data.docs?.[0];

              return {
                ...book,
                description: matchedBook?.first_sentence || matchedBook?.subtitle || null,
              };
            } catch {
              return book;
            }
          })
        );

        setFeaturedBooks(booksWithDescriptions);
        setLoading(false); // ✅ Stop spinner
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setLoading(false); // ✅ Stop spinner on error
      }
    };

    fetchBooks();
  }, []);

  const handleDownload = (book) => {
  if (!user) {
    alert("You must be logged in to download.");
    navigate("/Log");
    return;
  }

  // Open PDF or audio (mp3, wav) directly in browser tab
  const fileUrl = `http://localhost:5000/api/bookfile/${book._id}`;
  window.open(fileUrl, "_blank");
};


  const features = [
    {
      title: 'Vast Digital Collection',
      description: 'Access thousands of e-books, journals, research papers, and multimedia content across all academic disciplines.',
      icon: '📚'
    },
    {
      title: 'Advanced Search',
      description: 'Find exactly what you need with powerful search filters, boolean operators, and AI-powered recommendations.',
      icon: '🔍'
    },
    {
      title: 'Offline Reading',
      description: 'Download content for offline access and enjoy seamless reading experience across all your devices.',
      icon: <IoMdDownload />
    },
    {
      title: 'Academic Community',
      description: 'Connect with fellow researchers, join discussions, and share insights in our vibrant academic community.',
      icon: '👥'
    },
    {
      title: 'Secure Access',
      description: 'Role-based access control ensures you have appropriate permissions while maintaining content security.',
      icon: '🔒'
    },
    {
      title: 'Personal Library',
      description: 'Organize your reading with bookmarks, annotations, highlights, and personalized collections.',
      icon: '🔖'
    }
  ];

  if (loading) return <Spinner />; // ✅ Show spinner while loading
  return (
    <>
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content fade-in">
              <div className="hero-text">
                <h1 className="hero-title">
                  Your Gateway to
                  <span className="hero-title-accent">Digital Knowledge</span>
                </h1>
                <p className="hero-description">
                  Access thousands of e-books, research papers, journals, and multimedia resources from anywhere. 
                  Join our academic community and expand your learning horizons.
                </p>
              </div>
              <div className="hero-buttons">
                <NavLink to='/Log'><button className="btn btn-primary btn-large">
                  <LogW/>&nbsp;&nbsp;Get Started &nbsp;&nbsp;&nbsp;<FaCircleChevronRight/>&nbsp;&nbsp;
                </button></NavLink>
                <NavLink to='/Browse'><button className="btn btn-outline btn-large">
                  🔍 Browse Collection
                </button></NavLink>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Digital Books</div>
                </div>
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Research Papers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">5K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="hero-visual fade-in">
              <div className="book-card-demo">
                <div className="demo-lines">
                  <div className="demo-line demo-line-1"></div>
                  <div className="demo-line demo-line-2"></div>
                </div>
                <div className="demo-book-icon"><IoBookSharp /></div>
                <div className="demo-text-lines">
                  <div className="demo-text-line"></div>
                  <div className="demo-text-line demo-text-line-short"></div>
                  <div className="demo-text-line demo-text-line-shorter"></div>
                </div>
              </div>
              <div className="download-card-demo">
                <div className="demo-title"></div>
                <div className="demo-download-icon"><IoMdDownload /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need for Digital Learning</h2>
            <p className="section-description">
              Our comprehensive platform provides all the tools and resources you need for effective research and learning.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Featured Books Section */}
        <section className="featured-books" id='new'>
          <div className="featured-books-container">
            <div className="featured-books-header">
              <div>
                <h2 className="section-title">Featured Books</h2>
                <p className="section-subtitle">Discover our most popular and newly added resources</p>
              </div>
              <NavLink to='/Browse'><button className="btn btn-outline desktop-only">
                View All &nbsp;&nbsp;<FaLongArrowAltRight />
              </button></NavLink>
            </div>

            <div className="books-grid">
              {featuredBooks.map((book, index) => (
                <div key={index} className="book-card">
                  <div className="book-cover">
                    {book.cover ? (
                      <img src={`http://localhost:5000${book.cover}`} alt={book.title} className="book-cover-img" />
                    ) : (
                      <div className="book-icon"><IoBookSharp /></div>
                    )}
                    <button className="bookmark-btn">🔖</button>
                  </div>

                  <div className="book-content">
                    <div className="book-category">{book.category}</div>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    {book.description && (
                      <p className="book-description">{book.description}</p>
                    )}

                    {/* ✅ UPDATED ACTIONS SECTION */}
                    <div className="book-actions book-actions-equal">
                      <NavLink
                        to={
                          book.link.toLowerCase().endsWith(".pdf")
                            ? `/Read/${book._id}`
                            : `/Hear/${book._id}`
                        }
                        className="btn btn-primary btn-small"
                        style={{ padding: '12px 12px' }}
                      >
                        {book.link.toLowerCase().endsWith(".pdf") ? "📖 Read Online" : "🎧 Hear Online"}
                      </NavLink>

                      <button
                        className="btn btn-outline btn-small equal-width-btn"
                        onClick={() => handleDownload(book)}
                      >
                        <IoMdDownload /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="featured-books-cta">
              <NavLink to='/Browse'><button className="btn btn-primary">
                Explore Full Collection &nbsp;&nbsp;<FaLongArrowAltRight />
              </button></NavLink>
            </div>
          </div>
        </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Digital Books</div>
              <div className="stat-description">Comprehensive collection across all disciplines</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔬</div>
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Research Papers</div>
              <div className="stat-description">Latest academic research and publications</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👨‍🎓</div>
              <div className="stat-number">25,000+</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-description">Students and researchers worldwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <div className="stat-number">150+</div>
              <div className="stat-label">Universities</div>
              <div className="stat-description">Partner institutions globally</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="cta-description">
              Join our academic community today and get unlimited access to thousands of digital resources, 
              research tools, and collaborative features.
            </p>

            <div className="cta-buttons">
              <NavLink to='/Log'><button className="btn btn-white btn-large">
                <LogoB/>&nbsp;&nbsp; Get Started &nbsp;&nbsp;&nbsp;<FaCircleChevronRight/>
              </button></NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon"><LogW /></span>
                <span className="logo-text">Digital Library</span>
              </div>
              <p className="footer-description">
                Your gateway to digital knowledge. Access thousands of academic resources and join a community of learners.
              </p>
              <div className="footer-contact">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>codespartanssxc@gmail.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+91 89811 09323</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-section-title">Quick Links</h3>
              <ul className="footer-links">
                <li><NavLink to="/Browse" className="footer-link">Browse Books</NavLink></li>
                <li><NavLink to="/Browse?category=Research%20Paper" className="footer-link">Research Papers</NavLink></li>
                <li><a href="#new" className="footer-link">New Releases</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h3 className="footer-section-title">Categories</h3>
              <ul className="footer-links">
                <li><NavLink to="/Browse?category=Software%20Engineering" className="footer-link">Software Engineering</NavLink></li>
                <li><NavLink to="/Browse?category=Discrete%20Mathematics" className="footer-link">Discrete Mathematics</NavLink></li>
                <li><NavLink to="/Browse?category=Programming%20Language" className="footer-link">Programming Languages</NavLink></li>
                <li><NavLink to="/Browse?category=Web%20Development" className="footer-link">Web Development</NavLink></li>
                <li><NavLink to="/Browse?category=Fiction" className="footer-link">Fiction</NavLink></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3 className="footer-section-title">Support</h3>
              <ul className="footer-links">
                <li><NavLink to="/About" className="footer-link">Contact Us</NavLink></li>
                <li><NavLink to='/Policy' className="footer-link">Privacy Policy</NavLink></li>
                <li><NavLink to="/Terms" className="footer-link">Terms of Service</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 DigitalLibrary. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <NavLink to='/Policy' className="footer-bottom-link">Privacy</NavLink>
              <NavLink to='/Terms' className="footer-bottom-link">Terms</NavLink>
              <NavLink to="About" className="footer-bottom-link">Support</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default HomePage;