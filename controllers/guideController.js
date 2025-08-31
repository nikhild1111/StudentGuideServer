
// const Guide = require("../models/GuideApplication");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const cloudinary = require("../utils/cloudinary");

// // ----------------- APPLY FOR GUIDE -----------------
// exports.applyForGuide = async (req, res) => {
//   try {
//     const { id: userId, name, email } = req.user;
//     const {
//       phone,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender = "Prefer not to say",
//     } = req.body;

//     // 1️⃣ Check duplicate
//     const existing = await Guide.findOne({ email });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already applied or are already a Guide.",
//       });
//     }

//     let cloudinaryUrl = "";
//     let cloudinaryId = null;

//     // 2️⃣ Upload to Cloudinary if file exists
//     if (req.file) {
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "guide_uploads",
//       });
//       cloudinaryUrl = uploaded.secure_url;
//       cloudinaryId = uploaded.public_id;
//     }

//     // 3️⃣ Create guide application
//     const newGuide = await Guide.create({
//       name,
//       email,
//       phone,
//       image: cloudinaryUrl,
//       cloudinaryId,
//       department,
//       year,
//       city,
//       state,
//       country,
//       taluka,
//       gender,
//       role: "Student",
//     });

//     // 4️⃣ Link to user profile
//     await User.findByIdAndUpdate(userId, { guideProfile: newGuide._id });

//     // 5️⃣ Send emails
//     await mailSender(
//       email,
//       "Guide Application Received",
//       `Hello ${name}, your guide application has been received. We'll update you soon.`
//     );

//     await mailSender(
//       process.env.EMAIL_USER,
//       "New Guide Application",
//       `
//       📌 Name: ${name}
//       📧 Email: ${email}
//       📱 Phone: ${phone}
//       🏫 Department: ${department}
//       🎓 Year: ${year}
//       🌍 Location: ${taluka}, ${city}, ${state}, ${country}
//       🆔 Application ID: ${newGuide._id}
//       `
//     );

//     res.status(201).json({
//       success: true,
//       message: "Guide application submitted successfully.",
//       data: newGuide,
//     });
//   } catch (error) {
//     console.error("Guide apply error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while applying for guide",
//       error: error.message,
//     });
//   }
// };

// // ----------------- GET ALL GUIDES -----------------
// exports.getAllGuides = async (req, res) => {
//   try {
//     const { role, department, year, gender, search } = req.body;
//     const filter = {};

//     if (role) filter.role = role;
//     if (department) filter.department = department;
//     if (year) filter.year = year;
//     if (gender) filter.gender = gender;

//     if (search) {
//       const regex = new RegExp(search, "i");
//       filter.$or = [
//         { name: regex },
//         { email: regex },
//         { city: regex },
//         { state: regex },
//         { country: regex },
//         { department: regex },
//         { gender: regex },
//       ];
//     }

//     const guidesList = await Guide.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       students: guidesList.filter((g) => g.role === "Student"),
//       guides: guidesList.filter((g) => g.role === "Guide"),
//     });
//   } catch (error) {
//     console.error("Error fetching guides:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch guide data",
//       error: error.message,
//     });
//   }
// };

// // ----------------- APPROVE GUIDE -----------------
// exports.approveGuide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const guide = await Guide.findById(id);
//     if (!guide) {
//       return res.status(404).json({ success: false, message: "Guide not found" });
//     }

//     guide.role = "Guide";
//     await guide.save();

//     await mailSender(
//       guide.email,
//       "You are now a Guide!",
//       `Congrats ${guide.name}, your guide request has been approved.`
//     );

//     res.status(200).json({ success: true, message: "Guide approved successfully." });
//   } catch (error) {
//     console.error("Approve guide error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to approve guide",
//       error: error.message,
//     });
//   }
// };

// // ----------------- UPDATE GUIDE -----------------
// exports.updateGuide = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const guide = await Guide.findById(id);

//     if (!guide) {
//       return res.status(404).json({ success: false, message: "Guide not found" });
//     }

//     let newImageUrl = guide.image;
//     let newCloudinaryId = guide.cloudinaryId;

//     // If new image is uploaded
//     if (req.file) {
//       // Delete old image from Cloudinary if exists
//       if (guide.cloudinaryId) {
//         await cloudinary.uploader.destroy(guide.cloudinaryId);
//       }

//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "guide_uploads",
//       });
//       newImageUrl = uploaded.secure_url;
//       newCloudinaryId = uploaded.public_id;
//     }

//     const updatedGuide = await Guide.findByIdAndUpdate(
//       id,
//       { ...req.body, image: newImageUrl, cloudinaryId: newCloudinaryId },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Guide updated successfully.",
//       data: updatedGuide,
//     });
//   } catch (error) {
//     console.error("Update guide error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update guide",
//       error: error.message,
//     });
//   }
// };

// // ----------------- DELETE GUIDE -----------------
// exports.deleteGuide = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const guide = await Guide.findById(id);

//     if (!guide) {
//       return res.status(404).json({ success: false, message: "Guide not found" });
//     }

//     // Delete old image from Cloudinary if exists
//     if (guide.cloudinaryId) {
//       await cloudinary.uploader.destroy(guide.cloudinaryId);
//     }

//     // Delete Guide from collection
//     await Guide.findByIdAndDelete(id);

//     // // ✅ Remove reference from User profile
//     // await User.updateMany(
//     //   { guideProfile: id },
//     //   { $set: { guideProfile: null } }
//     // );


//     await User.findOneAndUpdate(
//   { guideProfile: id },
//   { $set: { guideProfile: null } },
//   { new: true }
// );


//     res.status(200).json({ success: true, message: "Guide deleted successfully and user profiles updated." });
//   } catch (error) {
//     console.error("Delete guide error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting guide",
//       error: error.message,
//     });
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

    // 1️⃣ Check duplicate application
    const existing = await Guide.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied or are already a Guide.",
      });
    }

    // 2️⃣ Handle image from multer-storage-cloudinary
    const image = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: "", public_id: null };

    // 3️⃣ Create guide application
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
      role: "Student",
    });

    // 4️⃣ Link guide profile to user
    await User.findByIdAndUpdate(userId, { guideProfile: newGuide._id });

    // 5️⃣ Send confirmation emails
    await mailSender(
      email,
      "Guide Application Received",
      `Hello ${name}, your guide application has been received. We'll update you soon.`
    );

    await mailSender(
      process.env.EMAIL_USER,
      "New Guide Application",
      `New guide application submitted:
      📌 Name: ${name}
      📧 Email: ${email}
      📱 Phone: ${phone}
      🏫 Department: ${department}
      🎓 Year: ${year}
      🌍 Location: ${taluka}, ${city}, ${state}, ${country}
      🆔 Application ID: ${newGuide._id}`
    );

    res.status(201).json({
      success: true,
      message: "Guide application submitted successfully.",
      guide: newGuide,
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
      message: "Failed to fetch guides",
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

    res.status(200).json({ success: true, message: "Guide approved successfully" });
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

    const updateData = { ...req.body };

    // ✅ Handle image replacement
    if (req.file) {
      if (guide.image?.public_id) {
        await cloudinary.uploader.destroy(guide.image.public_id);
      }
      updateData.image = { url: req.file.path, public_id: req.file.filename };
    } else {
      updateData.image = guide.image;
    }

    const updatedGuide = await Guide.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Guide updated successfully",
      guide: updatedGuide,
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

    // ✅ Delete image from Cloudinary
    if (guide.image?.public_id) {
      await cloudinary.uploader.destroy(guide.image.public_id);
    }

    // ✅ Delete guide
    await Guide.findByIdAndDelete(id);

    // ✅ Remove reference from User
    await User.findOneAndUpdate(
      { guideProfile: id },
      { $set: { guideProfile: null } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Guide deleted successfully and user profile updated",
    });
  } catch (error) {
    console.error("Delete guide error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete guide",
      error: error.message,
    });
  }
};
