// const express = require("express");
// const router = express.Router();
// const {
//    sendOtp, verifyOtp,
//   signUp,
//   login,
// } = require("../controllers/authController");


// // Public routes (no authentication required)
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
// router.post("/signup",auth, signUp);
// router.post("/login",auth, login);


// // Protected routes (authentication required)
// // router.get("/profile", auth, getProfile);
// // router.put("/profile", auth, updateProfile);
// // router.post("/change-password", auth, changePassword);
// // router.post("/logout", auth, logout);

// // Admin-only routes
// // router.get("/users", auth, authorize("admin"), getAllUsers);

// module.exports = router;


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
