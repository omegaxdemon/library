import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import { useAuth } from "../AuthContext";
import "./hearbook.css";
import { IoMdDownload } from "react-icons/io";
import { FaPlay, FaForward, FaBackward, FaPause } from "react-icons/fa";

const HearBook = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [book, setBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      alert("You must be logged in to listen to this audiobook.");
      navigate("/Log");
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((b) => b._id === bookId);
        if (match) {
          setBook(match);
        } else {
          alert("Audiobook not found");
          navigate("/Browse");
        }
      })
      .catch((err) => {
        console.error("Error loading audiobook:", err);
        navigate("/Browse");
      });
  }, [bookId]);

  if (!book) return null;

  const audioUrl = `http://localhost:5000${book.link}`;

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (secs) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime += secs;
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const current = (audio.currentTime / audio.duration) * 100;
      setProgress(current);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const bar = e.target;
    const clickX = e.nativeEvent.offsetX;
    const width = bar.clientWidth;
    const percent = clickX / width;
    if (audio && audio.duration) {
      audio.currentTime = percent * audio.duration;
    }
  };

  return (
    <>
      <Nav />
      <div className="hearbook-wrapper">
        <aside className="sidebar">
          <button onClick={() => navigate(-1)}>⬅ Go Back</button>
        </aside>

        <main className="audio-viewer">
          <h2>{book.title}</h2>
          <p>by {book.author}</p>

          <img
            src={`http://localhost:5000${book.cover}`}
            alt="Audiobook Cover"
            className="audio-cover"
          />

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
          />

          <div className="player-controls">
            <button onClick={() => skipTime(-10)}><FaBackward /></button>
            <button onClick={togglePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={() => skipTime(10)}><FaForward /></button>
          </div>

          {/* 🟦 Stylish Progress Bar */}
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>

          <a
            href={audioUrl}
            className="download-btn"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoMdDownload /> Download Audio
          </a>
        </main>
      </div>
    </>
  );
};

export default HearBook;
