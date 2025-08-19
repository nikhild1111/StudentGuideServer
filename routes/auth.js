
const express = require("express");
const User = require("../models/User");
const { auth ,isAdmin} = require("../middlewares/auth");
const {
  Signup,
  Login,
  sendOtp,
  verifyOtp,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", Signup);
// In authRoutes.js
router.get("/role", auth,isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post("/login", Login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout",auth,logout)
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Unable to fetch user" });
//   }
// });

// profile routes
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("mentorProfile guideProfile booksProfile");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch user" });
  }
});

router.put("/profile/update", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true })
      .select("-password")
      .populate("mentorProfile guideProfile booksProfile");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update profile" });
  }
});

router.put("/profile/books/add", auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { booksProfile: bookId } },
      { new: true }
    ).populate("booksProfile");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to add book" });
  }
});

router.put("/profile/books/remove", auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { booksProfile: bookId } },
      { new: true }
    ).populate("booksProfile");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to remove book" });
  }
});

router.put("/profile/mentor", auth, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { mentorProfile: mentorId },
      { new: true }
    ).populate("mentorProfile");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to update mentor" });
  }
});

router.put("/profile/guide", auth, async (req, res) => {
  try {
    const { guideId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { guideProfile: guideId },
      { new: true }
    ).populate("guideProfile");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to update guide" });
  }
});

module.exports = router;




// // routes/authRoutes.js - Updated with user profile routes
// const express = require("express");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { auth, isAdmin } = require("../middlewares/auth");
// const {
//   Signup,
//   Login,
//   sendOtp,
//   verifyOtp,
//   logout,
// } = require("../controllers/authController");

// const router = express.Router();

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname.split('.').pop());
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   },
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// // Authentication routes
// router.post("/signup", Signup);
// router.post("/login", Login);
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
// router.post("/logout", auth, logout);

// // Admin role check
// router.get("/role", auth, isAdmin, (req, res) => {
//   res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// });

// // Get user profile with populated references
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select("-password")
//       .populate("mentorProfile")
//       .populate("guideProfile")
//       .populate("booksProfile");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user profile",
//       error: error.message
//     });
//   }
// });

// // Update user profile
// router.put("/profile", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const updates = req.body;

//     // Remove sensitive fields that shouldn't be updated directly
//     delete updates.password;
//     delete updates.email;
//     delete updates.role;
//     delete updates._id;

//     // Validate year for students
//     if (updates.year && (updates.year < 1 || updates.year > 4)) {
//       return res.status(400).json({
//         success: false,
//         message: "Year must be between 1 and 4"
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating profile",
//       error: error.message
//     });
//   }
// });

// // Update password
// router.put("/password", auth, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.user.id;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password and new password are required"
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be at least 6 characters long"
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Verify current password
//     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect"
//       });
//     }

//     // Hash new password
//     const saltRounds = 10;
//     const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update password
//     await User.findByIdAndUpdate(userId, {
//       password: hashedNewPassword
//     });

//     res.status(200).json({
//       success: true,
//       message: "Password updated successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating password",
//       error: error.message
//     });
//   }
// });

// // Upload profile image
// router.post("/profile-image", auth, upload.single('profileImage'), async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No image file provided"
//       });
//     }

//     // Upload to cloudinary (if configured) or use local file path
//     let imageUrl;
    
//     if (cloudinary.config().cloud_name) {
//       // Upload to cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "student-guide/profiles",
//         width: 300,
//         height: 300,
//         crop: "limit"
//       });
//       imageUrl = result.secure_url;
//     } else {
//       // Use local file path (for development)
//       imageUrl = `/uploads/${req.file.filename}`;
//     }

//     // Update user profile with new image URL
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profileImage: imageUrl },
//       { new: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile image updated successfully",
//       profileImage: imageUrl,
//       user: updatedUser
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error uploading profile image",
//       error: error.message
//     });
//   }
// });

// // Delete user account
// router.delete("/account", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { password } = req.body;

//     if (!password) {
//       return res.status(400).json({
//         success: false,
//         message: "Password is required to delete account"
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect password"
//       });
//     }

//     // Delete user account
//     await User.findByIdAndDelete(userId);

//     res.status(200).json({
//       success: true,
//       message: "Account deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting account",
//       error: error.message
//     });
//   }
// });

// // Get user dashboard stats
// router.get("/dashboard-stats", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     const user = await User.findById(userId)
//       .populate("booksProfile")
//       .populate("mentorProfile")
//       .populate("guideProfile");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Calculate profile completion
//     const profileFields = ['name', 'email', 'phone', 'college', 'department', 'year'];
//     const completedFields = profileFields.filter(field => user[field]).length;
//     const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

//     const stats = {
//       totalBooks: user.booksProfile?.length || 0,
//       activeMentorships: user.mentorProfile ? 1 : 0,
//       guidesFollowed: user.guideProfile ? 1 : 0,
//       profileCompletion
//     };

//     res.status(200).json({
//       success: true,
//       stats
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching dashboard stats",
//       error: error.message
//     });
//   }
// });

// module.exports = router;