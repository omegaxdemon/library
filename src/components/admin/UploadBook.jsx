import React, { useState } from 'react';
import './admin.css';
import Spinner from '../Spinner'; // ✅ Import Spinner

const UploadBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !category || !bookFile || !coverImage) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("bookFile", bookFile);
    formData.append("coverImage", coverImage);

    setLoading(true); // ✅ Start loader

    try {
      const res = await fetch("https://library-backend-fwfr.onrender.com/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Book uploaded successfully!");
        setTitle('');
        setAuthor('');
        setCategory('');
        setBookFile(null);
        setCoverImage(null);
      } else {
        alert(data.msg || "❌ Upload failed");
      }
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <div className="admin-upload-container">
      <div className="admin-upload-card">
        <center><h2>Upload Book / Audiobook</h2></center>
        <form onSubmit={handleSubmit} className="admin-upload-form">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />

          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            disabled={loading}
          />

          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loading}
          />

          <label>Upload Book (PDF, MP3, WAV, M4A):</label>
          <input
            type="file"
            accept=".pdf,.mp3,.wav,.m4a"
            onChange={(e) => setBookFile(e.target.files[0])}
            required
            disabled={loading}
          />

          <label>Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            required
            disabled={loading}
          />
          <br />

          <center>
            {loading ? <Spinner /> : (
              <button type="submit" className="upload-btn" disabled={loading}>
                Upload
              </button>
            )}
          </center>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
