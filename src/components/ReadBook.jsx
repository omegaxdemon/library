import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import { useAuth } from "../AuthContext";
import "./readbook.css";
import { IoMdDownload } from "react-icons/io";

const ReadBook = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  // 🔒 Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      alert("You must be logged in to read this book.");
      navigate("/Log");
    }
  }, [user]);

  // 📚 Fetch the specific book info by ID
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((b) => b._id === bookId);
        if (match) {
          setBook(match);
        } else {
          alert("Book not found");
          navigate("/Browse");
        }
      })
      .catch((err) => {
        console.error("Error loading book:", err);
        navigate("/Browse");
      });
  }, [bookId]);

  if (!book) return null;

  const pdfUrl = `http://localhost:5000/api/bookfile/${book._id}`;

  return (
    <>
      <Nav />
      <div className="readbook-wrapper">
        <aside className="sidebar">
          <button onClick={() => navigate(-1)}>⬅ Go Back</button>
        </aside>

        <main className="pdf-viewer">
          <h2>{book.title}</h2>

          <iframe
            src={pdfUrl}
            width="100%"
            height="800px"
            title="PDF Viewer"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          />

          <a
            href={pdfUrl}
            className="download-btn"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoMdDownload/> Download PDF
          </a>
        </main>
      </div>
    </>
  );
};

export default ReadBook;
