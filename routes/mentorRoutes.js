const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { auth ,isAdmin} = require("../middlewares/auth");
const upload = require("../middlewares/cloudinaryUpload");
router.post("/all", mentorController.getMentors);

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
  (req,res,next)=>{
    console.log("DEBUG => Body:", req.body);
    console.log("DEBUG => Files:", req.files);
    next();
  },
  mentorController.addMentor
);


router.put("/update/:id", auth, mentorController.updateMentor);
router.delete("/delete/:id", auth, mentorController.deleteMentor);
router.post("/search", mentorController.searchMentors);
router.get("/sort", mentorController.sortMentors);

module.exports = router;
