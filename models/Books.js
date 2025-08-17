const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },       // User name
  email: { type: String, required: true },      // User email for validation
  department: { type: String, required: true },
  year: { type: String, required: true },
  semister: { type: Number },
  booksname: { type: [String], required: true }, // Array of book names
  price: { type: String },
  contact: { type: String, required: true },

  images: [
    {
      url: String,
      public_id: String
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Books", bookSchema);
