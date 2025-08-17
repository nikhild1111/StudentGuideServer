
// 1. How Cloudinary Works
// Cloudinary is a cloud storage and media management service.
// Process:
// User uploads image → Your backend receives it
// Backend sends the file to Cloudinary API
// Cloudinary stores the file → Returns a secure URL
// You store this URL in your database, not the file
// 2. Setup Cloudinary in Node.js
// Step 1: Install Packages
// npm install cloudinary multer multer-storage-cloudinary
// cloudinary → SDK for Cloudinary API
// multer → Handles file uploads in Express
// multer-storage-cloudinary → Directly uploads to Cloudinary
// Step 2: Configure Cloudinary
// Create utils/cloudinary.js:
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;
// Step 3: Setup Multer with Cloudinary
// Create middlewares/upload.js:
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../utils/cloudinary');

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'books',         // Folder name in Cloudinary
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });
// const upload = multer({ storage });
// module.exports = upload;


// Step 4: Upload Route Example
// const express = require('express');
// const upload = require('../middlewares/upload');
// const Books = require('../models/Books');
// const User = require('../models/User');
// const router = express.Router();

// router.post('/uploadbooks', upload.array('images', 5), async (req, res) => {
//   try {
//     const imageUrls = req.files.map(file => file.path); // Cloudinary returns .path as URL

//     const newBook = await Books.create({
//       name: req.body.name,
//       department: req.body.department,
//       image: imageUrls,
//       booksname: req.body.booksname.split(','),
//       year: req.body.year,
//       semister: req.body.semister,
//       price: req.body.price,
//       contact: req.body.contact,
//     });

//     // Add to user's booksProfile
//     await User.findByIdAndUpdate(req.user.id, {
//       $push: { booksProfile: newBook._id },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Book uploaded successfully",
//       book: newBook
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Upload failed" });
//   }
// });




// How Cloudinary Handles public_id by Default
// Cloudinary automatically generates a unique public_id (like books/abcd1234xyz)
// This public_id is used for:
// Accessing the image via URL
// Deleting or overwriting the image

// When You Need to Manually Set public_id
// You should manually set it if:
// You want predictable file names (like book_{userId}_{timestamp})
// You want to overwrite an existing file instead of uploading a new one

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'books',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     public_id: (req, file) => `${req.user.id}_${Date.now()}`,  // custom name
//   },
// });


// Key Notes
// If you don’t set public_id, Cloudinary generates a random one

// If you set a public_id with the same name twice, the new upload overwrites the old one (unless you specify unique_filename: true)