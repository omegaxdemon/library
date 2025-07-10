import React, { useEffect, useState } from 'react';
import './browse.css';
import Nav from './nav/Nav';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Spinner from './Spinner'; // ✅ Import your custom logo spinner

const Student_dashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true); // ✅ Spinner state
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false); // ✅ Hide spinner
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false); // ✅ Hide spinner even if error
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) setActiveCategory(category);
  }, [location.search]);

  const uniqueCategories = ['All', ...new Set(books.map(book => book.category))];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const filteredBooks = books.filter((book) => {
    const matchTitleOrAuthor =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      activeCategory === 'All' || book.category === activeCategory;

    return matchTitleOrAuthor && matchCategory;
  });

  const handleReadOnline = (book) => {
    const file = book.link.toLowerCase();
    if (file.endsWith(".pdf")) {
      navigate(`/Read/${book._id}`);
    } else if (file.endsWith(".mp3") || file.endsWith(".wav")||file.endsWith(".m4a")) {
      navigate(`/Hear/${book._id}`);
    } else {
      alert("Unsupported file format");
    }
  };

  if (loading) return <Spinner />; // ✅ Show spinner during loading

  return (
    <>
      <Nav />
      <div className="dashboard">
        <main>
          <div className="container">
            <h1 className="section-title">📚 Browse Books</h1>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="tags">
              {uniqueCategories.map((cat) => (
                <div
                  key={cat}
                  className={`tag ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="books">
              {filteredBooks.length === 0 ? (
                <p style={{ color: "gray" }}>No books found.</p>
              ) : (
                filteredBooks.map((book) => (
                  <div className="book-card" key={book._id}>
                    <img
                      src={`http://localhost:5000${book.cover}`}
                      alt={book.title}
                    />
                    <h3>{book.title}</h3>
                    <p>by {book.author}</p>
                    <div className="book-actions">
                      {user ? (
                        <a
                          href={encodeURI(`http://localhost:5000${book.link}`)}
                          className="btn"
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        <button
                          className="btn"
                          onClick={() => {
                            alert("Please log in to download this book.");
                            navigate("/Log");
                          }}
                        >
                          Download
                        </button>
                      )}

                      <button className="btn" onClick={() => handleReadOnline(book)}>
                        {book.link.toLowerCase().endsWith(".pdf") ? "Read Online" : "Hear Online"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Student_dashboard;
