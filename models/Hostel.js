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
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    video: {
      type: String,
      default: "",
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
        default: [],
      },
    ],
    address: {
      full: { type: String, default: "" },
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
      default: "No description provided",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hostel", hostelSchema);
