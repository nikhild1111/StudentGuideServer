// // controllers/guideController.js
// const Guide = require("../models/GuideApplication");
// const mailSender = require("../utils/mailSender");
// exports.applyForGuide = async (req, res) => {
//   try {
//     const { email, name } = req.user;

//     const {
//       phone,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender,
//     } = req.body;

//     // ✅ Get image from uploaded file or fallback
//    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";


//     const existing = await Guide.findOne({ email });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Already applied or is already a Guide.",
//       });
//     }

//     const newGuide = await Guide.create({
//       name,
//       email,
//       phone,
//       image,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender,
//     });



//     await mailSender(
//       process.env.EMAIL_USER,
//       "New Guide Application",
//       `
//         New guide application received:

//         📌 Name: ${name}
//         📧 Email: ${email}
//         📱 Phone: ${phone}
//         🏫 Department: ${department}
//         🎓 Year: ${year}
//         🌍 Location: ${taluka}, ${city}, ${state}, ${country}
//         🆔 Application ID: ${newGuide._id}

//         Please review this request in the Admin Panel.
//       `
//     );

//     res.status(200).json({
//       success: true,
//       message: "Application submitted successfully.",
//       data: newGuide,
//     });
//   } catch (error) {
//     console.error("Guide apply error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while applying.",
//     });
//   }
// };




// whitout the cludanry

// const Guide = require("../models/GuideApplication");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");

// exports.applyForGuide = async (req, res) => {
//   try {
//     const { email, name, id: userId } = req.user;

//     const {
//       phone,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender,
//     } = req.body;

//     const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

//     // Check if user already applied as guide
//     const existing = await Guide.findOne({ email });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Already applied or is already a Guide.",
//       });
//     }

//     // 1️⃣ Create new guide application
//     const newGuide = await Guide.create({
//       name,
//       email,
//       phone,
//       image,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender,
//     });

//     // 2️⃣ Link this guide to the user
//     await User.findByIdAndUpdate(userId, {
//       guideProfile: newGuide._id
//     });


//         // Send emails...

    
//     await mailSender(
//       email,
//       "Guide Application Received",
//       `Hello ${name}, your guide application has been received. We'll update you soon.`
//     );

//     // 3️⃣ Send admin notification email
//     await mailSender(
//       process.env.EMAIL_USER,
//       "New Guide Application",
//       `
//         New guide application received:

//         📌 Name: ${name}
//         📧 Email: ${email}
//         📱 Phone: ${phone}
//         🏫 Department: ${department}
//         🎓 Year: ${year}
//         🌍 Location: ${taluka}, ${city}, ${state}, ${country}
//         🆔 Application ID: ${newGuide._id}

//         Please review this request in the Admin Panel.
//       `
//     );

//     // ✅ Success response
//     res.status(200).json({
//       success: true,
//       message: "Application submitted successfully.",
//       data: newGuide,
//     });

//   } catch (error) {
//     console.error("Guide apply error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while applying.",
//     });
//   }
// };



// // controllers/guideController.js

// exports.getAllGuides = async (req, res) => {
//   try {
//     const {
//       role,        // "Student" or "Guide" or undefined
//       department,  // IT, CE, etc.
//       year,        // 1 to 4
//       gender,      // Male, Female, etc.
//       search       // any text
//     } = req.body;

//     const filter = {};
// console.log(" filer option " ,filter);
//     // Optional filters
//     if (role) filter.role = role;
//     if (department) filter.department = department;
//     if (year) filter.year = year;
//     if (gender) filter.gender = gender;

//     // Search filter (applies OR search across multiple fields)
//     if (search) {
//       const searchRegex = new RegExp(search, "i"); // case-insensitive match
//       filter.$or = [
//         { name: searchRegex },
//         { email: searchRegex },
//         { city: searchRegex },
//         { state: searchRegex },
//         { country: searchRegex },
//         { department: searchRegex },
//         { gender: searchRegex },
//       ];
//     }

//     // Fetch based on filters (or all if empty)
//     const guidesList = await Guide.find(filter);

//     const students = guidesList.filter((g) => g.role === "Student");
//     const guides = guidesList.filter((g) => g.role === "Guide");

// console.log(students);
// console.log(guides);

//     res.status(200).json({
//       success: true,
//       students,
//       guides,
//     });
//   } catch (error) {
//     console.error("Error fetching guide data:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch guide data.",
//     });
//   }
// };




// exports.approveGuide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const guide = await Guide.findById(id);
//     if (!guide) return res.status(404).json({ success: false, message: "Guide not found" });

//     guide.role = "Guide";
//     await guide.save();

//     // await mailSender(
//     //   guide.email,
//     //   "You are now a Guide!",
//     //   `Congrats ${guide.name}, your guide request has been approved.`
//     // );
//   await mailSender(
//       process.env.EMAIL_USER,
//       `
//         New guide application  approved:

//         📌 Name: ${name}
//         📧 Email: ${email}
//         📱 Phone: ${phone}
//         🏫 Department: ${department}
//         🎓 Year: ${year}
//         🌍 Location: ${taluka}, ${city}, ${state}, ${country}
//         🆔 Application ID: ${newGuide._id}

//         Please review this approved in the Admin Panel.
//       `
//     );



//     res.status(200).json({ success: true, message: "Guide approved." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to approve guide" });
//   }
// };



// exports.deleteGuide = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Guide.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Guide application deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting guide" });
//   }
// };


const Guide = require("../models/GuideApplication");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const cloudinary = require("../utils/cloudinary");

// ----------------- APPLY FOR GUIDE -----------------
exports.applyForGuide = async (req, res) => {
  try {
    const { id: userId, name, email } = req.user;
    const {
      phone,
      department,
      year,
      city,
      state,
      country,
      taluka,
      gender = "Prefer not to say",
    } = req.body;

    // 1️⃣ Check duplicate
    const existing = await Guide.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied or are already a Guide.",
      });
    }

    let cloudinaryUrl = "";
    let cloudinaryId = null;

    // 2️⃣ Upload to Cloudinary if file exists
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "guide_uploads",
      });
      cloudinaryUrl = uploaded.secure_url;
      cloudinaryId = uploaded.public_id;
    }

    // 3️⃣ Create guide application
    const newGuide = await Guide.create({
      name,
      email,
      phone,
      image: cloudinaryUrl,
      cloudinaryId,
      department,
      year,
      city,
      state,
      country,
      taluka,
      gender,
      role: "Student",
    });

    // 4️⃣ Link to user profile
    await User.findByIdAndUpdate(userId, { guideProfile: newGuide._id });

    // 5️⃣ Send emails
    await mailSender(
      email,
      "Guide Application Received",
      `Hello ${name}, your guide application has been received. We'll update you soon.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Guide Application",
      `
      📌 Name: ${name}
      📧 Email: ${email}
      📱 Phone: ${phone}
      🏫 Department: ${department}
      🎓 Year: ${year}
      🌍 Location: ${taluka}, ${city}, ${state}, ${country}
      🆔 Application ID: ${newGuide._id}
      `
    );

    res.status(201).json({
      success: true,
      message: "Guide application submitted successfully.",
      data: newGuide,
    });
  } catch (error) {
    console.error("Guide apply error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while applying for guide",
      error: error.message,
    });
  }
};

// ----------------- GET ALL GUIDES -----------------
exports.getAllGuides = async (req, res) => {
  try {
    const { role, department, year, gender, search } = req.body;
    const filter = {};

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (gender) filter.gender = gender;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { city: regex },
        { state: regex },
        { country: regex },
        { department: regex },
        { gender: regex },
      ];
    }

    const guidesList = await Guide.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      students: guidesList.filter((g) => g.role === "Student"),
      guides: guidesList.filter((g) => g.role === "Guide"),
    });
  } catch (error) {
    console.error("Error fetching guides:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide data",
      error: error.message,
    });
  }
};

// ----------------- APPROVE GUIDE -----------------
exports.approveGuide = async (req, res) => {
  try {
    const { id } = req.params;

    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    guide.role = "Guide";
    await guide.save();

    await mailSender(
      guide.email,
      "You are now a Guide!",
      `Congrats ${guide.name}, your guide request has been approved.`
    );

    res.status(200).json({ success: true, message: "Guide approved successfully." });
  } catch (error) {
    console.error("Approve guide error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to approve guide",
      error: error.message,
    });
  }
};

// ----------------- UPDATE GUIDE -----------------
exports.updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);

    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    let newImageUrl = guide.image;
    let newCloudinaryId = guide.cloudinaryId;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (guide.cloudinaryId) {
        await cloudinary.uploader.destroy(guide.cloudinaryId);
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "guide_uploads",
      });
      newImageUrl = uploaded.secure_url;
      newCloudinaryId = uploaded.public_id;
    }

    const updatedGuide = await Guide.findByIdAndUpdate(
      id,
      { ...req.body, image: newImageUrl, cloudinaryId: newCloudinaryId },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Guide updated successfully.",
      data: updatedGuide,
    });
  } catch (error) {
    console.error("Update guide error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update guide",
      error: error.message,
    });
  }
};

// ----------------- DELETE GUIDE -----------------
exports.deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);

    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    // Delete old image from Cloudinary
    if (guide.cloudinaryId) {
      await cloudinary.uploader.destroy(guide.cloudinaryId);
    }

    await Guide.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Guide deleted successfully." });
  } catch (error) {
    console.error("Delete guide error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting guide",
      error: error.message,
    });
  }
};
