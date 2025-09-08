const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
// ------------------ DELETE USER PROFILE 
const Mentor = require("../models/Mentor");
const Guide = require("../models/GuideApplication");
const Books = require("../models/Books");

const mentorController = require("../controllers/mentorController");
const guideController = require("../controllers/guideController");
const booksController = require("../controllers/booksContoller");


// ------------------ GET USER PROFILE ------------------
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("mentorProfile guideProfile booksProfile");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};


// Good question 👍
// By default, Mongoose has a setting called strict which is true in your schema.
// That means:
// Any field not in the schema (e.g. randomField: "abc") will be ignored when creating/updating.
// It will not be saved to MongoDB.
// await User.findByIdAndUpdate(id, { name: "Nikhil", xyz: "test" });
// 👉 Here xyz is not in schema → it will be ignored automatically.
// 🔑 Key Points
// Schema strict mode → Ignores unknown fields automatically.
// Whitelist approach → Only keeps required fields → double safety.
// runValidators: true → Ensures even on update, schema rules (like year: 1–4) are checked.



// ------------------ UPDATE USER PROFILE ------------------
exports.updateUserProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 🚫 Prevent role update
    if (updateData.role) {
      delete updateData.role;
    }

    // ✅ If new image uploaded, replace in Cloudinary
    if (req.file) {
      const user = await User.findById(req.user.id);
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }
      updateData.profileImage = { url: req.file.path, public_id: req.file.filename };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};


exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    if (user.mentorProfile) {
      await mentorController.deleteMentorById(user.mentorProfile);
    }

    if (user.guideProfile) {
      await guideController.deleteGuideById(user.guideProfile);
    }

    if (user.booksProfile && user.booksProfile.length > 0) {
      for (const bookId of user.booksProfile) {
        await booksController.deleteBookById(bookId);
      }
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "User profile and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
};
