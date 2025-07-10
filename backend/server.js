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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/books", express.static(path.join(__dirname, "books")));

const nodemailer = require("nodemailer");

const otpStore = {}; // In-memory store for email-OTP pairs

// ✉️ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codespartanssxc@gmail.com",     
    pass: "wpempwhavufayvtk"          
  }
});


mongoose.connect("mongodb://localhost:27017/eLibrary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Multer for profile uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const uploadProfile = multer({ storage: profileStorage });

// ✅ Multer for paper uploads (MODIFIED)
const paperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const title = req.body.title.trim();
    const folderPath = path.join(__dirname, "books", title);
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.title.trim()}.pdf`);
  },
});
const uploadPaper = multer({ storage: paperStorage });

// ✅ Multer for admin book/audio upload
const adminStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const title = req.body.title.trim();
    const folderPath = path.join(__dirname, "books", title);
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const field = file.fieldname === "bookFile" ? req.body.title : "cover";
    cb(null, `${field}${ext}`);
  },
});
const uploadAdmin = multer({ storage: adminStorage });

// ✅ Sign Up
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

// ✅ Update Profile
app.put("/api/profile/:email", uploadProfile.single("profilePic"), async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = {};
    if (req.file) updateData.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
    if (req.body.preference) updateData.preference = req.body.preference;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
});

// ✅ Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching books", error: err.message });
  }
});

// ✅ Serve Book File (PDF or Audio)
app.get("/api/bookfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found");

    const relativePath = book.link.replace(/^\/books/, "books");
    const filePath = path.join(__dirname, relativePath);
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    // 🔍 Detect file extension
    const ext = path.extname(filePath).toLowerCase();

    // ✅ Set correct Content-Type
    if (ext === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
    } else if (ext === ".mp3") {
      res.setHeader("Content-Type", "audio/mpeg");
    } else if (ext === ".wav") {
      res.setHeader("Content-Type", "audio/wav");
    } else if (ext === ".m4a") {
      res.setHeader("Content-Type", "audio/mp4");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }

    // 📂 Stream the file
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error("Error serving book:", err);
    res.status(500).send("Error serving book");
  }
});


// ✅ Upload Research Paper (MODIFIED)
app.post("/api/upload-paper", uploadPaper.single("paper"), async (req, res) => {
  try {
    const { title, uploader } = req.body;
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const filePath = `/books/${title}/${title}.pdf`;

    const book = new Book({
      title,
      author: uploader,
      category: "Research Paper",
      link: filePath,
      cover: "/uploads/research-default.jpg",
    });

    await book.save();
    res.status(201).json({ msg: "Paper uploaded", book });
  } catch (err) {
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

// ✅ Admin Upload Book/Audio
app.post("/api/admin/upload", uploadAdmin.fields([
  { name: "bookFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, category } = req.body;
    if (!req.files.bookFile || !req.files.coverImage) {
      return res.status(400).json({ msg: "Book file and cover are required" });
    }

    const fileExt = path.extname(req.files.bookFile[0].originalname);
    const isAudio = fileExt === ".mp3" || fileExt === ".wav"|| fileExt === ".m4a";
    const filePath = `/books/${title}/${title}${fileExt}`;
    const coverPath = `/books/${title}/${req.files.coverImage[0].filename}`;

    const book = new Book({
      title,
      author,
      category,
      link: filePath,
      cover: coverPath,
    });

    await book.save();
    res.status(201).json({ msg: "Book uploaded successfully", book });
  } catch (err) {
    console.error("Admin upload failed:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

// ✅ Admin Delete Book/Audio
app.delete("/api/admin/delete/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    const dir = path.join(__dirname, "books", book.title);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }

    await Book.findByIdAndDelete(book._id);
    res.json({ msg: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});

// ✅ Admin Manage Users
//Get all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({ userType: { $ne: "admin" } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});
// Update user role
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
// Delete user
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

// 🚀 Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: "codespartanssxc@gmail.com", // ✅ Your Gmail
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP for registration is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: "OTP sent" });

    // Optional: Clear OTP after 5 minutes
    setTimeout(() => {
      delete otpStore[email];
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// ✅ Verify OTP & Create Account
app.post("/api/verify-otp-signup", async (req, res) => {
  const { email, otp, ...userData } = req.body;

  if (otpStore[email] !== otp) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ email, ...userData });
    await newUser.save();

    delete otpStore[email];
    res.status(201).json({ msg: "User created", user: newUser });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});



// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
