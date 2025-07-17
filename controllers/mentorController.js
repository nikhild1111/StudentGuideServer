
// controllers/mentorController.js
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

exports.addMentor = async (req, res) => {
  try {
    const userId = req.user.id;
    const email1 = req.body.email; 


console.log(req.body);

   const count = await Mentor.countDocuments({ email: req.body.email });
    if (count >1 ) {
      return res.status(400).json({ success: false, message: "You are already mentors." });
    }

    const {
      name,
      email,
      phone = "0000000000",
      department,
      passoutYear,
      gender = "Prefer not to say",
      domain = "none",
    } = req.body;

    // Handle companies as JSON string
    let companies = [];
    if (req.body.companies) {
      try {
        companies = JSON.parse(req.body.companies);
        if (!Array.isArray(companies)) {
          throw new Error("Companies must be an array.");
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid format for companies" });
      }
    }

    // Handle file uploads
    const files = req.files || {};
    const image = files.image ? `/uploads/${files.image[0].filename}` : "";
    const resume = files.resume ? `/uploads/${files.resume[0].filename}` : "";

    const newMentor = new Mentor({
      user: userId,
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

    await newMentor.save();

    // Send confirmation emails
    await mailSender(
      email,
      "Mentor Application Received",
      `Hello ${name}, your mentor application has been received. We'll update you soon.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Mentor Application",
      `New mentor application received:\n\n📌 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n🏫 Department: ${department}\n🎓 Year: ${passoutYear}\n🆔 Application ID: ${newMentor._id}`
    );

    res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      data: newMentor,
    });
  } catch (error) {
    console.error("Error in addMentor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.getMentors = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", department = "" } = req.body;
    const query = { };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) query.department = department;

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching data", error: err.message });
  }
};


exports.updateMentor = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const userId = req.user.id;
    const update = { ...req.body };

    // Get existing mentor first
    const existingMentor = await Mentor.findOne({ _id: mentorId, user: userId });
    if (!existingMentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    // Parse companies
    if (update.companies) {
      try {
        const parsed = JSON.parse(update.companies);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({ success: false, message: "Companies must be an array" });
        }
        update.companies = parsed;
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid companies format" });
      }
    }

    const files = req.files || {};

    // Handle image
    if (files.image && files.image.length > 0) {
      const newImagePath = `/uploads/${files.image[0].filename}`;
      const oldImagePath = existingMentor.image;

      // Delete old image if exists and is custom (not default placeholder)
      if (oldImagePath && !oldImagePath.includes("Sample_User_Icon")) {
        const fullPath = path.join(__dirname, "../..", "public", oldImagePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      update.image = newImagePath;
    }

    // Handle resume
    if (files.resume && files.resume.length > 0) {
      const newResumePath = `/uploads/${files.resume[0].filename}`;
      const oldResumePath = existingMentor.resume;

      // Delete old resume if it exists and is custom
      if (oldResumePath && !oldResumePath.includes("Sample_User_Icon")) {
        const fullPath = path.join(__dirname, "../..", "public", oldResumePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      update.resume = newResumePath;
    }

    // Perform the update
    const updatedMentor = await Mentor.findOneAndUpdate(
      { _id: mentorId, user: userId },
      update,
      { new: true }
    );

    await mailSender(
      updatedMentor.email,
      "Mentor Profile Updated",
      `Hi ${updatedMentor.name}, your mentor profile has been successfully updated.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      `Mentor profile updated:\n\n📌 Name: ${updatedMentor.name}\n📧 Email: ${updatedMentor.email}\n📱 Phone: ${updatedMentor.phone}\n🏫 Department: ${updatedMentor.department}\n🎓 Year: ${updatedMentor.passoutYear}\n🆔 Application ID: ${updatedMentor._id}`
    );

    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      data: updatedMentor,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting", error: err.message });
  }
};

exports.searchMentors = async (req, res) => {
  try {
    const { name, department, company, year,domain, page = 1, limit = 6 } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (department) query.department = department;
    if (company) query.companies = company;
    if (company) query.domain = domain;
    if (year) query.passoutYear = parseInt(year);

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
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
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: mentors,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sorting failed", error: err.message });
  }
};

