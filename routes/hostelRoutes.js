// const express = require("express");
// const {
//   createHostel,
//   updateHostel,
//   deleteHostel,
//   getHostels,
// } = require("../controllers/hostelController");
// const upload = require("../middlewares/upload");

// const router = express.Router();

// router.post("/create", upload.array("images", 6), createHostel);
// router.put("/update/:id", upload.array("images", 6), updateHostel);
// router.delete("/delete/:id", deleteHostel);
// router.post("/fetch", getHostels);

// module.exports = router;






const express = require("express");
const router = express.Router();
const makeUploader = require("../middlewares/cloudUpload");
const {
  createHostel,
  updateHostel,
  deleteHostel,
  getHostels,
} = require("../controllers/hostelController");

// Multer-Cloudinary uploader (limit 6 images)
const hostelUpload = makeUploader("hosteluploads");

router.post("/create", hostelUpload.array("images", 6), createHostel);
router.put("/update/:id", hostelUpload.array("images", 6), updateHostel);
router.delete("/delete/:id", deleteHostel);
router.post("/fetch", getHostels);

module.exports = router;
