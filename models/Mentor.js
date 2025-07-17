// // models/Mentor.js
// const mongoose = require("mongoose");

// const mentorSchema = new mongoose.Schema({
//   // user: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: "User",
//   //   required: true,
//   // },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, default: "0000000000" },
//   image: { type: String },
//   department: { type: String, required: true },
//   passoutYear: { type: Number, required: true },
//   companies: [{ type: String, required: true }],
//   gender: { type: String, default: "Prefer not to say" },
// }, { timestamps: true });

// module.exports = mongoose.model("Mentor", mentorSchema);






const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mentor name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      default: "0000000000",
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    passoutYear: {
      type: Number,
      required: [true, "Passout year is required"],
      min: [1900, "Year must be valid"],
    },
    companies: {
      type: [String],
      required: [true, "At least one company is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Prefer not to say",
    },
    domain:{
      type:String,
      default:"none"
    },resume:{
        type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    }
  },
  {
    timestamps: true,
  }
);

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
