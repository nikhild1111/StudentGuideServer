
const express = require("express");
const User = require("../models/User");
const { auth ,isAdmin} = require("../middlewares/auth");
const {
  Signup,
  Login,
  sendOtp,
  verifyOtp,
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
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch user" });
  }
});


module.exports = router;
