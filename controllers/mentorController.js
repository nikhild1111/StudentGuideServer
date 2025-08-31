// controllers/mentorController.js
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const cloudinary = require("cloudinary").v2;

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

    // prevent duplicate mentor
    const existing = await Mentor.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "You are already registered as a mentor" });

    // Parse companies
    let companies = [];
    if (req.body.companies) {
      try {
        companies = JSON.parse(req.body.companies);
        if (!Array.isArray(companies)) throw new Error();
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid format for companies" });
      }
    }

    const files = req.files || {};

    // store both url & public_id
    const image = files.image?.[0]
      ? { url: files.image[0].path, public_id: files.image[0].filename }
      : null;
    const resume = files.resume?.[0]
      ? { url: files.resume[0].path, public_id: files.resume[0].filename }
      : null;

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
      status: "pending", // default mentor status
    });

    await User.findByIdAndUpdate(userId, { mentorProfile: newMentor._id });

    // Send confirmation mail
    await mailSender(
      email,
      "Mentor Application Received",
      `Hello ${name}, your mentor application has been received and is under review.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Mentor Application",
      `New mentor application:\n
      📌 Name: ${name}
      📧 Email: ${email}
      🏫 Dept: ${department}
      🎓 Year: ${passoutYear}`
    );

    res.status(201).json({ success: true, message: "Mentor added successfully", data: newMentor });
  } catch (error) {
    console.error("AddMentor error:", error);
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

    if (update.companies) {
      try {
        const parsed = JSON.parse(update.companies);
        if (!Array.isArray(parsed)) throw new Error();
        update.companies = parsed;
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid companies format" });
      }
    }

    const files = req.files || {};

    // Replace image if new uploaded
    if (files.image && files.image[0]) {
      if (existingMentor.image?.public_id) {
        await cloudinary.uploader.destroy(existingMentor.image.public_id);
      }
      update.image = {
        url: files.image[0].path,
        public_id: files.image[0].filename,
      };
    }

    // Replace resume if new uploaded
    if (files.resume && files.resume[0]) {
      if (existingMentor.resume?.public_id) {
        await cloudinary.uploader.destroy(existingMentor.resume.public_id);
      }
      update.resume = {
        url: files.resume[0].path,
        public_id: files.resume[0].filename,
      };
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, update, {
      new: true,
    });

    // await mailSender(
    //   updatedMentor.email,
    //   "Mentor Profile Updated",
    //   `Hi ${updatedMentor.name}, your mentor profile was successfully updated.`
    // );

    res.json({ success: true, message: "Mentor updated successfully", data: updatedMentor });
  } catch (err) {
    console.error("UpdateMentor error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

// ----------------- DELETE MENTOR -----------------
exports.deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findById(id);
    if (!mentor)
      return res.status(404).json({ success: false, message: "Mentor not found" });

    // Delete Cloudinary files
    if (mentor.image?.public_id) await cloudinary.uploader.destroy(mentor.image.public_id);
    if (mentor.resume?.public_id) await cloudinary.uploader.destroy(mentor.resume.public_id);

    await Mentor.findByIdAndDelete(id);

//     await User.findByIdAndUpdate(
//   req.user.id,
//   { $set: { mentorProfile: null } },
//   { new: true }
// );
    // 🧹 Remove mentorProfile reference from all users who had this mentor

    await User.updateMany({ mentorProfile: id }, { $set: { mentorProfile: null } });

    res.json({ success: true, message: "Mentor deleted successfully" });
  } catch (err) {
    console.error("DeleteMentor error:", err);
    res.status(500).json({ success: false, message: "Error deleting mentor", error: err.message });
  }
};

// ----------------- APPROVE MENTOR -----------------
exports.approveMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }


    mentor.role = "mentor";   // directly set role here
    await mentor.save();

    // send mail to mentor
    await mailSender(
      mentor.email,
      "Mentor Approved",
      `Congratulations ${mentor.name}, your mentor profile has been approved!`
    );

    // send mail to admin
    await mailSender(
      process.env.ADMIN_EMAIL,
      "Mentor Profile Approved",
      `Mentor ${mentor.name} (${mentor.email}) has been approved successfully.`
    );

    res.json({
      success: true,
      message: "Mentor approved successfully",
      data: mentor,
    });
  } catch (err) {
    console.error("ApproveMentor error:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: err.message,
    });
  }
};

// ----------------- GET, SEARCH, SORT -----------------
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
      .limit(Number(limit));

    res.json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching mentors", error: err.message });
  }
};

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
    if (department) query.department = new RegExp(`^${department}$`, "i");
   if (company) query.companies = { $elemMatch: { $regex: company, $options: "i" } };
    if (domain) query.domain = new RegExp(domain, "i");
    if (year) query.passoutYear = parseInt(year);

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};

exports.sortMentors = async (req, res) => {
  try {
    const { sortBy = "name", order = "asc", page = 1, limit = 6 } = req.query;
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const total = await Mentor.countDocuments();
    const mentors = await Mentor.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: mentors,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sorting failed", error: err.message });
  }
};




// const Mentor = require("../models/Mentor");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");

// // ----------------- ADD MENTOR -----------------
// exports.addMentor = async (req, res) => {
//   try {
//     const { id: userId } = req.user;
//     const {
//       name,
//       email,
//       phone = "0000000000",
//       department,
//       passoutYear,
//       gender = "Prefer not to say",
//       domain = "none",
//     } = req.body;

//     // Check duplicate mentor
//     const existing = await Mentor.countDocuments({ email });
//     if (existing > 0)
//       return res.status(400).json({ success: false, message: "You are already a mentor." });

//     // Parse companies JSON if provided
//     let companies = [];
//     if (req.body.companies) {
//       try {
//         companies = JSON.parse(req.body.companies);
//         if (!Array.isArray(companies)) throw new Error();
//       } catch {
//         return res.status(400).json({ success: false, message: "Invalid format for companies" });
//       }
//     }

//     // ✅ Files from multer-storage-cloudinary (already uploaded to Cloudinary)
//     const files = req.files || {};
//     const image = files.image?.[0]?.path || "";
//     const resume = files.resume?.[0]?.path || "";

//     // Create mentor
//     const newMentor = await Mentor.create({
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

//     // Link mentor to user
//     await User.findByIdAndUpdate(userId, { mentorProfile: newMentor._id });

//     // Send emails
//     await mailSender(
//       email,
//       "Mentor Application Received",
//       `Hello ${name}, your mentor application has been received. We'll update you soon.`
//     );

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

//     res.status(201).json({ success: true, message: "Mentor added successfully", data: newMentor });
//   } catch (error) {
//     console.error("Error in addMentor:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // ----------------- UPDATE MENTOR -----------------
// exports.updateMentor = async (req, res) => {
//   try {
//     const mentorId = req.params.id;
//     const update = { ...req.body };
// console.log('ggg');
//     const existingMentor = await Mentor.findById(mentorId);
//     if (!existingMentor)
//       return res.status(404).json({ success: false, message: "Mentor not found" });

//     // Parse companies if present
//     if (update.companies) {
//       try {
//         const parsed = JSON.parse(update.companies);
//         if (!Array.isArray(parsed)) throw new Error();
//         update.companies = parsed;
//       } catch {
//         return res.status(400).json({ success: false, message: "Invalid companies format" });
//       }
//     }

//     const files = req.files || {};

//     // ✅ Update image if new one is uploaded
//     if (files.image && files.image[0]) {
//       update.image = files.image[0].path; // Direct Cloudinary URL
//     }

//     // ✅ Update resume if new one is uploaded
//     if (files.resume && files.resume[0]) {
//       update.resume = files.resume[0].path; // Direct Cloudinary URL
//     }

//     const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, update, { new: true });

//     await mailSender(
//       updatedMentor.email,
//       "Mentor Profile Updated",
//       `Hi ${updatedMentor.name}, your mentor profile has been successfully updated.`
//     );

//     res.status(200).json({ success: true, message: "Mentor updated successfully", data: updatedMentor });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ success: false, message: "Update failed", error: err.message });
//   }
// };

// // ----------------- DELETE MENTOR -----------------
// exports.deleteMentor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const mentor = await Mentor.findById(id);
//     if (!mentor) {
//       return res.status(404).json({ success: false, message: "Mentor not found" });
//     }

//     // 🗑️ Delete the mentor
//     await Mentor.findByIdAndDelete(id);

// await User.findByIdAndUpdate(
//   req.user.id,
//   { $set: { mentorProfile: null } },
//   { new: true }
// );
//     // 🧹 Remove mentorProfile reference from all users who had this mentor
//     // await User.updateMany(
//     //   { mentorProfile: id },
//     //   { $set: { mentorProfile: null } }
//     // );

//     res.json({
//       success: true,
//       message: "Mentor deleted successfully and user profiles updated.",
//     });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting mentor",
//       error: err.message,
//     });
//   }
// };
// // ----------------- GET MENTORS (Paginated + Search + Filter) -----------------
// exports.getMentors = async (req, res) => {
//   try {
//     const { page = 1, limit = 6, search = "", department = "" } = req.body;
//     const query = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { domain: { $regex: search, $options: "i" } },
//         { companies: { $regex: search, $options: "i" } },
//       ];
//     }
//     if (department) query.department = department;

//     const total = await Mentor.countDocuments(query);
//     const mentors = await Mentor.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       data: mentors,
//       pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error fetching mentors", error: err.message });
//   }
// };

// // ----------------- SEARCH MENTORS (Advanced) -----------------
// exports.searchMentors = async (req, res) => {
//   try {
//     const { keyword = "", department, company, year, domain, page = 1, limit = 6 } = req.body;
//     const query = {};
// console.log(req.body);
//     if (keyword) {
//       const regex = new RegExp(keyword, "i");
//       query.$or = [
//         { name: regex },
//         { email: regex },
//         { department: regex },
//         { domain: regex },
//         { companies: regex },
//       ];
//     }
//  if (department) query.department = new RegExp(`^${department}$`, "i");
// if (company) query.companies = new RegExp(company, "i");
// if (domain) query.domain = new RegExp(domain, "i");
// if (year) query.passoutYear = parseInt(year);


//     const total = await Mentor.countDocuments(query);
//     const mentors = await Mentor.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .sort({ createdAt: -1 });
// console.log(mentors,"   dd  ",query)
//     res.status(200).json({
//       success: true,
//       data: mentors,
//       pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Search failed", error: err.message });
//   }
// };

// // ----------------- SORT MENTORS -----------------
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
//       pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Sorting failed", error: err.message });
//   }
// };
