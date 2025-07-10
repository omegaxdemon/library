// book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  link: String,   // e.g., "/books/Algorithms in C/book.pdf"
  cover: String   // e.g., "/books/Algorithms in C/cover.png"
});

module.exports = mongoose.model("Book", bookSchema); // collection will be named "books"
