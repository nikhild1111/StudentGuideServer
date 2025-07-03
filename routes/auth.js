// const express = require("express");
// const router = express.Router();
// const {
//    sendOtp, verifyOtp,
//   signUp,
//   login,
// } = require("../controllers/authController");
// const { auth ,isAdmin} = require("../middlewares/auth");

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


const express = require("express")
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

module.exports = router;
