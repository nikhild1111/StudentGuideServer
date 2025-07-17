const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  college: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  gender: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'vendor'],
    default: 'student',
    required: true,
  },
  department: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true,
  },
  year: {
    type: Number,
    required: function() {
      return this.role === 'student';
    },
    min: 1,
    max: 4,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});
module.exports = mongoose.model("User", userSchema);
