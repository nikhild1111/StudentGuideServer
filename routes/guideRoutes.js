// // routes/guideRoutes.js
// const express = require("express");
// const { auth, isAdmin } = require("../middlewares/auth");
// const {
//   applyForGuide,
//   getAllGuides,
//   approveGuide,
//   deleteGuide
// } = require("../controllers/guideController");

// const upload = require("../middlewares/upload"); // ✅ your multer file
// const router = express.Router();


// router.post("/apply-guide", auth, upload.single("image"), applyForGuide);
// router.post("/admin/guides", getAllGuides); // Admin views
// router.put("/admin/approve-guide/:id", auth, isAdmin, approveGuide); // Admin approves
// router.delete("/admin/guide/:id", auth, isAdmin, deleteGuide); // Admin deletes

// module.exports = router;




const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
// here we use the cloudnary
const guideUpload = require("../middlewares/guideUpload");
const {
  applyForGuide,
  getAllGuides,
  approveGuide,
  deleteGuide,
  updateGuide,
} = require("../controllers/guideController");
const checkOwnership =require('../middlewares/checkOwnership')
const router = express.Router();

// Apply for guide
router.post("/apply-guide", auth, guideUpload.single("image"), applyForGuide);

// Admin: View all guides
router.post("/admin/guides",   getAllGuides);

// Admin: Approve guide
router.put("/admin/approve-guide/:id", auth, isAdmin, approveGuide);

// Admin: Update guide (fields + optional image)
router.put(
  "/admin/guide/:id",
  auth,
  checkOwnership("guide"),
  guideUpload.single("image"),
  updateGuide
);

// Admin or Owner: Delete guide
router.delete("/guide/:id", auth, checkOwnership("guide"), deleteGuide);

module.exports = router;

