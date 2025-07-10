const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const User = require("./user");
const Book = require("./book");

const app = express();
app.use(cors());
app.use(express.json());

const nodemailer = require("nodemailer");
const otpStore = {}; // In-memory store for email-OTP pairs

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codespartanssxc@gmail.com",
    pass: "wpempwhavufayvtk"
  }
});

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dl6qmklgj",
  api_key: "643459465832868",
  api_secret: "NyYp7Jvo6lM28OQwCg9uKSe4lHE",
});

mongoose.connect('mongodb+srv://omegaxdemon:Debottam%408@elibrary.snzqi8b.mongodb.net/eLibrary?retryWrites=true&w=majority&appName=eLibrary');

// ✅ Multer temp storage for Cloudinary uploads
const uploadTemp = multer({ dest: "temp/" });

/* ======================= SIGN UP & LOGIN ======================= */

// ✅ OTP-based Sign Up (Step 1)
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: "codespartanssxc@gmail.com",
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP for registration is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: "OTP sent" });
    setTimeout(() => delete otpStore[email], 5 * 60 * 1000);
  } catch (error) {
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// ✅ OTP Verification (Step 2)
app.post("/api/verify-otp-signup", async (req, res) => {
  const { email, otp, ...userData } = req.body;
  if (otpStore[email] !== otp) return res.status(400).json({ msg: "Invalid or expired OTP" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ email, ...userData });
    await newUser.save();

    delete otpStore[email];
    res.status(201).json({ msg: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Legacy Signup Fallback (if OTP not used)
app.post("/api/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ msg: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Sign In
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password, securityQuestion, securityAnswer } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No user with that email" });

    if (
      user.password !== password ||
      user.securityQuestion !== securityQuestion ||
      user.securityAnswer !== securityAnswer
    )
      return res.status(401).json({ msg: "Incorrect credentials" });

    res.status(200).json({ msg: "Login successful", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ======================= PROFILE UPDATE ======================= */

app.put("/api/profile/:email", uploadTemp.single("profilePic"), async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = {};

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
        public_id: `${email.replace(/[@.]/g, "_")}_profile`,
      });
      fs.unlinkSync(req.file.path);
      updateData.profilePic = uploadResult.secure_url;
    }

    if (req.body.preference) updateData.preference = req.body.preference;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
});

/* ======================= BOOK UPLOADS ======================= */

// ✅ Get All Books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching books", error: err.message });
  }
});

// ✅ Upload Research Paper (Cloudinary only)
app.post("/api/upload-paper", uploadTemp.single("paper"), async (req, res) => {
  try {
    const { title, uploader } = req.body;
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "books",
      public_id: title.replace(/\s+/g, "_"),
    });

    fs.unlinkSync(req.file.path);

    const book = new Book({
      title,
      author: uploader,
      category: "Research Paper",
      link: cloudResult.secure_url,
      cover: "https://res.cloudinary.com/dl6qmklgj/image/upload/v1719999999/books/research-default.jpg"
    });

    await book.save();
    res.status(201).json({ msg: "Paper uploaded", book });
  } catch (err) {
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

// ✅ Admin Upload Book or Audio
app.post("/api/admin/upload", uploadTemp.fields([
  { name: "bookFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const bookFile = req.files.bookFile?.[0];
    const coverFile = req.files.coverImage?.[0];

    if (!bookFile || !coverFile) {
      return res.status(400).json({ msg: "Book file and cover are required" });
    }

    const folderName = `books/${title.replace(/\s+/g, "_")}`;

    const bookUpload = await cloudinary.uploader.upload(bookFile.path, {
      resource_type: "auto",
      folder: folderName,
      public_id: "file"
    });

    const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
      folder: folderName,
      public_id: "cover"
    });

    fs.unlinkSync(bookFile.path);
    fs.unlinkSync(coverFile.path);

    const book = new Book({
      title,
      author,
      category,
      link: bookUpload.secure_url,
      cover: coverUpload.secure_url,
    });

    await book.save();
    res.status(201).json({ msg: "Book uploaded successfully", book });
  } catch (err) {
    console.error("Admin upload failed:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

/* ======================= ADMIN PANEL ======================= */

// ✅ Admin Delete Book (DB only)
app.delete("/api/admin/delete/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    const folderName = `books/${book.title.replace(/\s+/g, "_")}`;

    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
      max_results: 100
    });

    for (const file of resources) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.resource_type || "image"
      });
    }

    await Book.findByIdAndDelete(book._id);
    res.json({ msg: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});

// ✅ Admin Manage Users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({ userType: { $ne: "admin" } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

app.put("/api/admin/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { email: newEmail, userType } = req.body;

    const updated = await User.findOneAndUpdate(
      { email },
      { email: newEmail, userType },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User updated", user: updated });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
});

app.delete("/api/admin/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});

/* ======================= START SERVER ======================= */

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
