const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { auth ,isAdmin} = require("../middlewares/auth");
const upload = require("../middlewares/upload"); 
router.post("/all", mentorController.getMentors);
router.post("/add", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  
  mentorController.addMentor);
router.put("/update/:id", auth, mentorController.updateMentor);
router.delete("/delete/:id", auth, mentorController.deleteMentor);
router.post("/search", mentorController.searchMentors);
router.get("/sort", mentorController.sortMentors);

module.exports = router;
