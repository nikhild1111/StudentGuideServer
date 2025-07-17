// routes/guideRoutes.js
const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  applyForGuide,
  getAllGuides,
  approveGuide,
  deleteGuide
} = require("../controllers/guideController");

const upload = require("../middlewares/upload"); // ✅ your multer file
const router = express.Router();


router.post("/apply-guide", auth, upload.single("image"), applyForGuide);
router.post("/admin/guides", getAllGuides); // Admin views
router.put("/admin/approve-guide/:id", auth, isAdmin, approveGuide); // Admin approves
router.delete("/admin/guide/:id", auth, isAdmin, deleteGuide); // Admin deletes

module.exports = router;











