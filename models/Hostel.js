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
      default: 0, // 👈 if not sent
    },
    images: [
      {
        type: String,
        default: [], // 👈 empty array if no images
      },
    ],
    video: {
      type: String,
      default: "", // 👈 empty if not sent
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
        default: [], // 👈 empty if not sent
      },
    ],
    address: {
      full: {
        type: String,
        required: false, // 👈 make optional if you want
        default: "",
      },
      landmark: { type: String, default: "" },
      gully: { type: String, default: "" },
      building: { type: String, default: "" },
    },
    contact: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "No description provided", // 👈 fallback text
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hostel", hostelSchema);
