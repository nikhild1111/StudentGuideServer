const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  image: { type: String },
  department: { type: String },
  year: { type: Number, min: 1, max: 4, default: 4 },
  city: { type: String, default: "Pune" },
  state: { type: String, default: "Maharashtra" },
  country: { type: String, default: "India" },
  taluka: { type: String },
  gender: { type: String },
  role: { type: String, enum: ["Student", "Guide"], default: "Guide" },
  pay: { type: Number, default: 1000 },
}, { timestamps: true });

module.exports = mongoose.model("GuideApplication", guideSchema);
