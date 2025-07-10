const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  institution: String,
  userType: String,
  securityQuestion: String,
  securityAnswer: String,
  profilePic: {
    type: String,
    default: "/default-avatar.png", // This should match your front-end
  },
  preference: {
    type: String,
    default: "",
  },
  uploadedPapers: [
    {
      title: String,
      filePath: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
