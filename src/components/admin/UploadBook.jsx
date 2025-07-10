import React, { useState } from 'react';
import './admin.css';

const UploadBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

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

    try {
      const res = await fetch("http://localhost:5000/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Book uploaded successfully!");
        setTitle('');
        setAuthor('');
        setCategory('');
        setBookFile(null);
        setCoverImage(null);
      } else {
        alert(data.msg || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="admin-upload-container">
      <div className="admin-upload-card">
        <center><h2>Upload Book / Audiobook</h2></center>
        <form onSubmit={handleSubmit} className="admin-upload-form">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />

          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <label>Upload Book (PDF or MP3):</label>
          <input type="file" accept=".pdf,.mp3" onChange={(e) => setBookFile(e.target.files[0])} required />

          <label>Cover Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} required />
            <br></br>
          <center><button type="submit" className="upload-btn">Upload</button></center>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
