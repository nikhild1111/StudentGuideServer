// const Hostel = require("../models/Hostel");
// const fs = require("fs");
// const path = require("path");

// // 🔸 Create Hostel
// exports.createHostel = async (req, res) => {
//   try {
//     const data = {};

//     if (req.body.name) data.name = req.body.name;
//     if (req.body.type) data.type = req.body.type;
//     if (req.body.rent) data.rent = req.body.rent;
//     if (req.body.rating) data.rating = req.body.rating;
//     if (req.body.video) data.video = req.body.video;
//     if (req.body.contact) data.contact = req.body.contact;
//     if (req.body.description) data.description = req.body.description;

//     // ✅ Handle images
//     if (req.files && req.files.length > 0) {
//       data.images = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     // ✅ Handle services (JSON string or array)
//     if (req.body.services) {
//       data.services =
//         typeof req.body.services === "string"
//           ? JSON.parse(req.body.services)
//           : req.body.services;
//     }

//     // ✅ Handle address (JSON string or object)
//     if (req.body.address) {
//       data.address =
//         typeof req.body.address === "string"
//           ? JSON.parse(req.body.address)
//           : req.body.address;
//     }

//     const hostel = await Hostel.create(data);

//     res.status(201).json({
//       success: true,
//       message: "Hostel added",
//       data: hostel,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create hostel",
//       error: err.message,
//     });
//   }
// };


// exports.updateHostel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existing = await Hostel.findById(id);
//     if (!existing) {
//       return res.status(404).json({ success: false, message: "Hostel not found" });
//     }

//     // ✅ Safely check req.files
//     let newImages = existing.images;
//     if (req.files && req.files.length > 0) {
//       // delete old images
//       if (existing.images.length > 0) {
//         existing.images.forEach((imgPath) => {
//           const fullPath = path.join(__dirname, "..", "public", imgPath);
//           if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//         });
//       }
//       newImages = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     // ✅ Safe JSON parse
//     const parseIfNeeded = (field, fallback) => {
//       if (!field) return fallback;
//       try {
//         return typeof field === "string" ? JSON.parse(field) : field;
//       } catch {
//         return fallback;
//       }
//     };

//     const updatedFields = {
//       ...req.body,
//       images: newImages,
//       address: parseIfNeeded(req.body.address, existing.address),
//       services: parseIfNeeded(req.body.services, existing.services),
//     };

//     const updated = await Hostel.findByIdAndUpdate(id, updatedFields, { new: true });

//     res.status(200).json({ success: true, message: "Hostel updated", data: updated });
//   } catch (err) {
//     console.error("Update hostel error:", err);
//     res.status(500).json({ success: false, message: "Update failed", error: err.message });
//   }
// };


// // 🔸 Delete Hostel
// exports.deleteHostel = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const hostel = await Hostel.findByIdAndDelete(id);
//     if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

//     // Delete images from filesystem
//     hostel.images.forEach((imgPath) => {
//       const fullPath = path.join(__dirname, "..", "public", imgPath);
//       if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//     });

//     res.status(200).json({ success: true, message: "Hostel deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Deletion failed", error: err.message });
//   }
// };

// // 🔸 Get Hostels with Filters + Search + Pagination
// exports.getHostels = async (req, res) => {
//   try {
//     const { page = 1, limit = 6, search = "", type = "all" } = req.body;

//     const query = {};
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { "address.full": { $regex: search, $options: "i" } },
//       ];
//     }

//     if (type === "boys" ||type === "girls") query.type = type;

//     const total = await Hostel.countDocuments(query);
//     const hostels = await Hostel.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: hostels,
//       pagination: {
//         total,
//         page: Number(page),
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch hostels", error: err.message });
//   }
// };



const Hostel = require("../models/Hostel");
const cloudinary = require("../utils/cloudinary");

// 🔸 Create Hostel
exports.createHostel = async (req, res) => {
  try {
    const data = {};

    if (req.body.name) data.name = req.body.name;
    if (req.body.type) data.type = req.body.type;
    if (req.body.rent) data.rent = req.body.rent;
    if (req.body.rating) data.rating = req.body.rating;
    if (req.body.video) data.video = req.body.video;
    if (req.body.contact) data.contact = req.body.contact;
    if (req.body.description) data.description = req.body.description;

    // ✅ Handle Cloudinary images
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.path); // Cloudinary URL
      data.imagePublicIds = req.files.map((file) => file.filename); // Store public_id too
    }

    // ✅ Handle services
    if (req.body.services) {
      data.services =
        typeof req.body.services === "string"
          ? JSON.parse(req.body.services)
          : req.body.services;
    }

    // ✅ Handle address
    if (req.body.address) {
      data.address =
        typeof req.body.address === "string"
          ? JSON.parse(req.body.address)
          : req.body.address;
    }

    const hostel = await Hostel.create(data);

    res.status(201).json({
      success: true,
      message: "Hostel added",
      data: hostel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create hostel",
      error: err.message,
    });
  }
};

// 🔸 Update Hostel
exports.updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Hostel.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    }

    let newImages = existing.images;
    let newPublicIds = existing.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      // ❌ Delete old Cloudinary images
      if (newPublicIds.length > 0) {
        for (let pid of newPublicIds) {
          await cloudinary.uploader.destroy(pid).catch(() => {});
        }
      }

      // ✅ Save new ones
      newImages = req.files.map((file) => file.path);
      newPublicIds = req.files.map((file) => file.filename);
    }

    const parseIfNeeded = (field, fallback) => {
      if (!field) return fallback;
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch {
        return fallback;
      }
    };

    const updatedFields = {
      ...req.body,
      images: newImages,
      imagePublicIds: newPublicIds,
      address: parseIfNeeded(req.body.address, existing.address),
      services: parseIfNeeded(req.body.services, existing.services),
    };

    const updated = await Hostel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Hostel updated", data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

// 🔸 Delete Hostel
exports.deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findByIdAndDelete(id);
    if (!hostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });

    // ❌ Delete images from Cloudinary
    if (hostel.imagePublicIds && hostel.imagePublicIds.length > 0) {
      for (let pid of hostel.imagePublicIds) {
        await cloudinary.uploader.destroy(pid).catch(() => {});
      }
    }

    res.status(200).json({ success: true, message: "Hostel deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: err.message,
    });
  }
};

// 🔸 Get Hostels with Filters + Search + Pagination
exports.getHostels = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", type = "all" } = req.body;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "address.full": { $regex: search, $options: "i" } },
      ];
    }

    if (type === "boys" || type === "girls") query.type = type;

    const total = await Hostel.countDocuments(query);
    const hostels = await Hostel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: hostels,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hostels",
      error: err.message,
    });
  }
};
