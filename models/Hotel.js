// models/Hotel.js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["veg", "non-veg", "both"],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    address: {
      full: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        default: "",
      },
      gully: {
        type: String,
        default: "",
      },
      building: {
        type: String,
        default: "",
      },
    },
    contact: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    menu: [
      {
        item: { type: String, required: true },
        price: { type: Number, required: true },
        type: {
          type: String,
          enum: ["veg", "non-veg", "other"],
          default: "veg",
        },
        details: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);
