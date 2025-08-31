const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const makeUploader = require("../middlewares/cloudUpload");
const checkOwnership = require("../middlewares/checkOwnership");
const { getUserProfile , updateUserProfile, deleteUserProfile } = require("../controllers/profileController");

// ✅ Upload profile images
const profileUpload = makeUploader("profile_uploads");

// ✅ Get user profile
router.get("/profile", auth, getUserProfile);

// ✅ Update user profile (image optional)
router.put("/update", auth, checkOwnership("profile"), profileUpload.single("profileImage"), updateUserProfile);

// ✅ Delete user profile
router.delete("/delete", auth, checkOwnership("profile"), deleteUserProfile);

module.exports = router;
