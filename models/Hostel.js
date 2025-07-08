const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["boys", "girls"],
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
    },
    services: [
      {
        type: String,
        enum: [
          "wifi",
          "security",
          "electricity",
          "food",
          "washing",
          "washroom",
          "personal_toilet",
          "water_filter",
        ],
      },
    ],
    address: {
      full: {
        type: String,
        required: true,
      },
      landmark: String,
      gully: String,
      building: String,
    },
    contact: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hostel", hostelSchema);
