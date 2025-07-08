// routes/hotel.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const hotelController = require("../controllers/hotelController");

router.post("/", upload.array("images", 10), hotelController.createHotel);
router.post("/list", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", upload.array("images", 10), hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;
