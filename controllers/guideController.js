// controllers/guideController.js
const Guide = require("../models/GuideApplication");
const mailSender = require("../utils/mailSender");
exports.applyForGuide = async (req, res) => {
  try {
    const { email, name } = req.user;

    const {
      phone,
      department,
      year,
      city,
      state,
      country,
      taluka,
      gender,
    } = req.body;

    // ✅ Get image from uploaded file or fallback
   const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";


    const existing = await Guide.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied or is already a Guide.",
      });
    }

    const newGuide = await Guide.create({
      name,
      email,
      phone,
      image,
      department,
      year,
      city,
      state,
      country,
      taluka,
      gender,
    });

    // Send emails...
    await mailSender(
      email,
      "Guide Application Received",
      `Hello ${name}, your guide application has been received. We'll update you soon.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Guide Application",
      `
        New guide application received:

        📌 Name: ${name}
        📧 Email: ${email}
        📱 Phone: ${phone}
        🏫 Department: ${department}
        🎓 Year: ${year}
        🌍 Location: ${taluka}, ${city}, ${state}, ${country}
        🆔 Application ID: ${newGuide._id}

        Please review this request in the Admin Panel.
      `
    );

    res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
      data: newGuide,
    });
  } catch (error) {
    console.error("Guide apply error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while applying.",
    });
  }
};





// controllers/guideController.js

exports.getAllGuides = async (req, res) => {
  try {
    const {
      role,        // "Student" or "Guide" or undefined
      department,  // IT, CE, etc.
      year,        // 1 to 4
      gender,      // Male, Female, etc.
      search       // any text
    } = req.body;

    const filter = {};
console.log(" filer option " ,filter);
    // Optional filters
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (gender) filter.gender = gender;

    // Search filter (applies OR search across multiple fields)
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive match
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex },
        { department: searchRegex },
        { gender: searchRegex },
      ];
    }

    // Fetch based on filters (or all if empty)
    const guidesList = await Guide.find(filter);

    const students = guidesList.filter((g) => g.role === "Student");
    const guides = guidesList.filter((g) => g.role === "Guide");

console.log(students);
console.log(guides);

    res.status(200).json({
      success: true,
      students,
      guides,
    });
  } catch (error) {
    console.error("Error fetching guide data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide data.",
    });
  }
};




exports.approveGuide = async (req, res) => {
  try {
    const { id } = req.params;

    const guide = await Guide.findById(id);
    if (!guide) return res.status(404).json({ success: false, message: "Guide not found" });

    guide.role = "Guide";
    await guide.save();

    await mailSender(
      guide.email,
      "You are now a Guide!",
      `Congrats ${guide.name}, your guide request has been approved.`
    );

    res.status(200).json({ success: true, message: "Guide approved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve guide" });
  }
};



exports.deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    await Guide.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Guide application deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting guide" });
  }
};
