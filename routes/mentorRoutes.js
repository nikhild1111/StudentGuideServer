// routes/mentorRoutes.js
const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { auth, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/mentorUploads");
const checkOwnership = require("../middlewares/checkOwnership");

// ----------------- GET ALL (with pagination/search/filter) -----------------
router.post("/all", mentorController.getMentors);

// ----------------- ADD MENTOR -----------------
router.post(
  "/add",
  auth,
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "resume", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      next();
    });
  },
  mentorController.addMentor
);

// ----------------- UPDATE MENTOR -----------------
router.put(
  "/update/:id",
  auth,
  checkOwnership("mentor"),
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "resume", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      next();
    });
  },
  mentorController.updateMentor
);

// ----------------- DELETE MENTOR -----------------
router.delete(
  "/delete/:id",
  auth,
  checkOwnership("mentor"),
  mentorController.deleteMentor
);

// ----------------- APPROVE MENTOR (ADMIN ONLY) -----------------
router.put(
  "/approve/:id",
  auth,
  isAdmin,
  mentorController.approveMentor
);

// ----------------- SEARCH + SORT -----------------
router.post("/search", mentorController.searchMentors);
router.get("/sort", mentorController.sortMentors);

module.exports = router;
