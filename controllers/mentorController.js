
// controllers/mentorController.js
// const Mentor = require("../models/Mentor");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const cloudinary = require("../utils/cloudinary");
// const fs = require("fs");
// const path = require("path");


// exports.addMentor = async (req, res) => {
//   try {
//     // const userId = req.user.id;
//     const email1 = req.body.email; 


// console.log(req.body);

//    const count = await Mentor.countDocuments({ email: req.body.email });
//     if (count >0 ) {
//       return res.status(400).json({ success: false, message: "You are already mentors." });
//     }

//     const {
//       name,
//       email,
//       phone = "0000000000",
//       department,
//       passoutYear,
//       gender = "Prefer not to say",
//       domain = "none",
//     } = req.body;

//     // Handle companies as JSON string
//     let companies = [];
//     if (req.body.companies) {
//       try {
//         companies = JSON.parse(req.body.companies);
//         if (!Array.isArray(companies)) {
//           throw new Error("Companies must be an array.");
//         }
//       } catch (err) {
//         return res.status(400).json({ success: false, message: "Invalid format for companies" });
//       }
//     }

//     // Handle file uploads
// const files = req.files || {};
// const image = files.image ? files.image[0].path : "";
// const resume = files.resume ? files.resume[0].path : "";


//     const newMentor = new Mentor({
//       // user: userId,
//       name,
//       email,
//       phone,
//       image,
//       resume,
//       department,
//       passoutYear,
//       companies,
//       gender,
//       domain,
//     });

//     await newMentor.save();

//     // Send confirmation emails
    
//     // await mailSender(
//     //   email,
//     //   "Mentor Application Received",
//     //   `Hello ${name}, your mentor application has been received. We'll update you soon.`
//     // );

//     await mailSender(
//       process.env.EMAIL_USER,
//       "New Mentor Application",
//       `New mentor application received:\n\n📌 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n🏫 Department: ${department}\n🎓 Year: ${passoutYear}\n🆔 Application ID: ${newMentor._id}`
//     );

//     res.status(201).json({
//       success: true,
//       message: "Mentor added successfully",
//       data: newMentor,
//     });
//   } catch (error) {
//     console.error("Error in addMentor:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };




// exports.addMentor = async (req, res) => {
//   try {
//     // ✅ Get logged-in user info
//     const { id: userId } = req.user;

//     console.log(req.body);

//     const count = await Mentor.countDocuments({ email: req.body.email });
//     if (count > 0) {
//       return res.status(400).json({ success: false, message: "You are already a mentor." });
//     }

//     const {
//       name,
//       email,
//       phone = "0000000000",
//       department,
//       passoutYear,
//       gender = "Prefer not to say",
//       domain = "none",
//     } = req.body;

//     // ✅ Handle companies as JSON string
//     let companies = [];
//     if (req.body.companies) {
//       try {
//         companies = JSON.parse(req.body.companies);
//         if (!Array.isArray(companies)) {
//           throw new Error("Companies must be an array.");
//         }
//       } catch (err) {
//         return res.status(400).json({ success: false, message: "Invalid format for companies" });
//       }
//     }

//     // ✅ Handle file uploads
//     const files = req.files || {};
//     const image = files.image ? files.image[0].path : "";
//     const resume = files.resume ? files.resume[0].path : "";

//     // ✅ Create new mentor profile
//     const newMentor = new Mentor({
//       name,
//       email,
//       phone,
//       image,
//       resume,
//       department,
//       passoutYear,
//       companies,
//       gender,
//       domain,
//     });

//     await newMentor.save();

//     // ✅ Link mentor to user (no role change)
//     await User.findByIdAndUpdate(userId, {
//       mentorProfile: newMentor._id,
//     });


//     // Send confirmation emails
    
//     await mailSender(
//       email,
//       "Mentor Application Received",
//       `Hello ${name}, your mentor application has been received. We'll update you soon.`
//     );



//     // ✅ Send admin notification email
//     await mailSender(
//       process.env.EMAIL_USER,
//       "New Mentor Application",
//       `New mentor application received:\n\n
//       📌 Name: ${name}
//       📧 Email: ${email}
//       📱 Phone: ${phone}
//       🏫 Department: ${department}
//       🎓 Year: ${passoutYear}
//       🆔 Application ID: ${newMentor._id}`
//     );

//     res.status(201).json({
//       success: true,
//       message: "Mentor added successfully",
//       data: newMentor,
//     });
//   } catch (error) {
//     console.error("Error in addMentor:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };


// exports.getMentors = async (req, res) => {
//   try {
//     const { page = 1, limit = 6, search = "", department = "" } = req.body;
//     const query = { };

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }
//     if (department) query.department = department;

//     const total = await Mentor.countDocuments(query);
//     const mentors = await Mentor.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: mentors,
//       pagination: {
//         total,
//         page: Number(page),
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error fetching data", error: err.message });
//   }
// };


// exports.updateMentor = async (req, res) => {
//   try {
//     const mentorId = req.params.id;
//     const userId = req.user.id;
//     const update = { ...req.body };

//     const existingMentor = await Mentor.findOne({ _id: mentorId, user: userId });
//     if (!existingMentor) {
//       return res.status(404).json({ success: false, message: "Mentor not found" });
//     }

//     // Parse companies
//     if (update.companies) {
//       try {
//         const parsed = JSON.parse(update.companies);
//         if (!Array.isArray(parsed)) {
//           return res.status(400).json({ success: false, message: "Companies must be an array" });
//         }
//         update.companies = parsed;
//       } catch (err) {
//         return res.status(400).json({ success: false, message: "Invalid companies format" });
//       }
//     }

//     const files = req.files || {};

//     // Handle image
//     if (files.image && files.image[0]) {
//       const imageFilePath = files.image[0].path;
//       const uploadedImage = await cloudinary.uploader.upload(imageFilePath, {
//         folder: "mentor_images",
//       });

//       // Delete old image from Cloudinary (if exists and is not a default)
//       if (existingMentor.image && existingMentor.image.includes("cloudinary")) {
//         const publicId = existingMentor.image.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(`mentor_images/${publicId}`);
//       }

//       update.image = uploadedImage.secure_url;
//       fs.unlinkSync(imageFilePath); // Delete local temp file
//     }

//     // Handle resume
//     if (files.resume && files.resume[0]) {
//       const resumeFilePath = files.resume[0].path;
//       const uploadedResume = await cloudinary.uploader.upload(resumeFilePath, {
//         folder: "mentor_resumes",
//         resource_type: "raw", // For PDF or DOCX
//       });

//       // Delete old resume from Cloudinary (if applicable)
//       if (existingMentor.resume && existingMentor.resume.includes("cloudinary")) {
//         const publicId = existingMentor.resume.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(`mentor_resumes/${publicId}`, {
//           resource_type: "raw",
//         });
//       }

//       update.resume = uploadedResume.secure_url;
//       fs.unlinkSync(resumeFilePath);
//     }

//     const updatedMentor = await Mentor.findOneAndUpdate(
//       { _id: mentorId, user: userId },
//       update,
//       { new: true }
//     );

//     await mailSender(
//       updatedMentor.email,
//       "Mentor Profile Updated",
//       `Hi ${updatedMentor.name}, your mentor profile has been successfully updated.`
//     );

//     await mailSender(
//       process.env.EMAIL_USER,
//       `Mentor profile updated:\n\n📌 Name: ${updatedMentor.name}\n📧 Email: ${updatedMentor.email}\n📱 Phone: ${updatedMentor.phone}\n🏫 Department: ${updatedMentor.department}\n🎓 Year: ${updatedMentor.passoutYear}\n🆔 Application ID: ${updatedMentor._id}`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Mentor updated successfully",
//       data: updatedMentor,
//     });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ success: false, message: "Update failed", error: err.message });
//   }
// };



// exports.deleteMentor = async (req, res) => {
//   try {
//     const mentor = await Mentor.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!mentor) {
//       return res.status(404).json({ success: false, message: "Mentor not found" });
//     }

//     // 🔴 Delete image from Cloudinary
//     if (mentor.image && mentor.image.includes("cloudinary")) {
//       const imagePublicId = mentor.image.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(`mentor_images/${imagePublicId}`);
//     }

//     // 🔴 Delete resume from Cloudinary (if it's a file)
//     if (mentor.resume && mentor.resume.includes("cloudinary")) {
//       const resumePublicId = mentor.resume.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(`mentor_resumes/${resumePublicId}`, {
//         resource_type: "raw",
//       });
//     }

//     // 🗑️ Delete mentor document
//     await Mentor.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Mentor deleted successfully" });

//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting mentor",
//       error: err.message,
//     });
//   }
// };

// exports.searchMentors = async (req, res) => {
//   try {
//     const {
//       keyword,
//       department,
//       company,
//       year,
//       domain,
//       page = 1,
//       limit = 6,
//     } = req.body;

//     const query = {};

//     if (keyword) {
//       const regex = new RegExp(keyword, "i");
//       query.$or = [
//         { name: regex },
//         { department: regex },
//         { companies: regex },
//         { domain: regex },
//         { email: regex }
//       ];
//     }

//     if (department) query.department = department;
//     if (company) query.companies = company;
//     if (domain) query.domain = domain;
//     if (year) query.passoutYear = parseInt(year);

//     const total = await Mentor.countDocuments(query);

//     const mentors = await Mentor.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       data: mentors,
//       pagination: {
//         total,
//         page: Number(page),
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Search failed",
//       error: err.message,
//     });
//   }
// };


// exports.sortMentors = async (req, res) => {
//   try {
//     const { sortBy = "name", order = "asc", page = 1, limit = 6 } = req.query;
//     const sort = {};
//     sort[sortBy] = order === "desc" ? -1 : 1;

//     const total = await Mentor.countDocuments();
//     const mentors = await Mentor.find()
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       data: mentors,
//       pagination: {
//         total,
//         page: Number(page),
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Sorting failed", error: err.message });
//   }
// };
















const Mentor = require("../models/Mentor");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

// ----------------- ADD MENTOR -----------------
exports.addMentor = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      name,
      email,
      phone = "0000000000",
      department,
      passoutYear,
      gender = "Prefer not to say",
      domain = "none",
    } = req.body;

    // Check duplicate mentor
    const existing = await Mentor.countDocuments({ email });
    if (existing > 0)
      return res.status(400).json({ success: false, message: "You are already a mentor." });

    // Parse companies JSON if provided
    let companies = [];
    if (req.body.companies) {
      try {
        companies = JSON.parse(req.body.companies);
        if (!Array.isArray(companies)) throw new Error();
      } catch {
        return res.status(400).json({ success: false, message: "Invalid format for companies" });
      }
    }

    // ✅ Files from multer-storage-cloudinary (already uploaded to Cloudinary)
    const files = req.files || {};
    const image = files.image?.[0]?.path || "";
    const resume = files.resume?.[0]?.path || "";

    // Create mentor
    const newMentor = await Mentor.create({
      name,
      email,
      phone,
      image,
      resume,
      department,
      passoutYear,
      companies,
      gender,
      domain,
    });

    // Link mentor to user
    await User.findByIdAndUpdate(userId, { mentorProfile: newMentor._id });

    // Send emails
    await mailSender(
      email,
      "Mentor Application Received",
      `Hello ${name}, your mentor application has been received. We'll update you soon.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Mentor Application",
      `New mentor application received:\n\n
      📌 Name: ${name}
      📧 Email: ${email}
      📱 Phone: ${phone}
      🏫 Department: ${department}
      🎓 Year: ${passoutYear}
      🆔 Application ID: ${newMentor._id}`
    );

    res.status(201).json({ success: true, message: "Mentor added successfully", data: newMentor });
  } catch (error) {
    console.error("Error in addMentor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ----------------- UPDATE MENTOR -----------------
exports.updateMentor = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const update = { ...req.body };

    const existingMentor = await Mentor.findById(mentorId);
    if (!existingMentor)
      return res.status(404).json({ success: false, message: "Mentor not found" });

    // Parse companies if present
    if (update.companies) {
      try {
        const parsed = JSON.parse(update.companies);
        if (!Array.isArray(parsed)) throw new Error();
        update.companies = parsed;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid companies format" });
      }
    }

    const files = req.files || {};

    // ✅ Update image if new one is uploaded
    if (files.image && files.image[0]) {
      update.image = files.image[0].path; // Direct Cloudinary URL
    }

    // ✅ Update resume if new one is uploaded
    if (files.resume && files.resume[0]) {
      update.resume = files.resume[0].path; // Direct Cloudinary URL
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, update, { new: true });

    await mailSender(
      updatedMentor.email,
      "Mentor Profile Updated",
      `Hi ${updatedMentor.name}, your mentor profile has been successfully updated.`
    );

    res.status(200).json({ success: true, message: "Mentor updated successfully", data: updatedMentor });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

// ----------------- DELETE MENTOR -----------------
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Mentor deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting mentor", error: err.message });
  }
};

// ----------------- GET MENTORS (Paginated + Search + Filter) -----------------
exports.getMentors = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", department = "" } = req.body;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { companies: { $regex: search, $options: "i" } },
      ];
    }
    if (department) query.department = department;

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching mentors", error: err.message });
  }
};

// ----------------- SEARCH MENTORS (Advanced) -----------------
exports.searchMentors = async (req, res) => {
  try {
    const { keyword = "", department, company, year, domain, page = 1, limit = 6 } = req.body;
    const query = {};

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { department: regex },
        { domain: regex },
        { companies: regex },
      ];
    }
    if (department) query.department = department;
    if (company) query.companies = company;
    if (domain) query.domain = domain;
    if (year) query.passoutYear = parseInt(year);

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};

// ----------------- SORT MENTORS -----------------
exports.sortMentors = async (req, res) => {
  try {
    const { sortBy = "name", order = "asc", page = 1, limit = 6 } = req.query;
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const total = await Mentor.countDocuments();
    const mentors = await Mentor.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sorting failed", error: err.message });
  }
};
