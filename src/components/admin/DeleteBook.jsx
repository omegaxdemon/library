import React, { useEffect, useState } from 'react';
import './admin.css';
import Spinner from '../Spinner'; // ✅ Spinner import

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/books");
      const data = await res.json();
      setBooks(data);
      setLoading(false); // ✅ Stop spinner
    } catch (err) {
      console.error("Failed to fetch books", err);
      setLoading(false); // ✅ Stop spinner on error
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete/${bookId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Book deleted successfully!");
        fetchBooks();
      } else {
        alert(data.msg || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <Spinner />; // ✅ Show spinner while loading

  return (
    <div className="admin-upload-container">
      <div className="admin-upload-card">
        <center><h2>📚 Delete Existing Books / Audiobooks</h2></center>
        {books.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>No books available.</p>
        ) : (
          <div className="book-list">
            {books.map((book) => (
              <div key={book._id} className="book-item">
                <img
                  src={`http://localhost:5000${book.cover}`}
                  alt="cover"
                  className="book-cover"
                />
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Type:</strong> {book.link.endsWith(".mp3") ? "Audiobook" : "Book"}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(book._id)}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBook;
