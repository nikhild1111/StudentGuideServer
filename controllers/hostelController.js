const Hostel = require("../models/Hostel");
const fs = require("fs");
const path = require("path");

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

    // ✅ Handle images
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // ✅ Handle services (JSON string or array)
    if (req.body.services) {
      data.services =
        typeof req.body.services === "string"
          ? JSON.parse(req.body.services)
          : req.body.services;
    }

    // ✅ Handle address (JSON string or object)
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


exports.updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Hostel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    // ✅ Safely check req.files
    let newImages = existing.images;
    if (req.files && req.files.length > 0) {
      // delete old images
      if (existing.images.length > 0) {
        existing.images.forEach((imgPath) => {
          const fullPath = path.join(__dirname, "..", "public", imgPath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
      }
      newImages = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // ✅ Safe JSON parse
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
      address: parseIfNeeded(req.body.address, existing.address),
      services: parseIfNeeded(req.body.services, existing.services),
    };

    const updated = await Hostel.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ success: true, message: "Hostel updated", data: updated });
  } catch (err) {
    console.error("Update hostel error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};


// 🔸 Delete Hostel
exports.deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findByIdAndDelete(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    // Delete images from filesystem
    hostel.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", "public", imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    res.status(200).json({ success: true, message: "Hostel deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed", error: err.message });
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

    if (type === "boys" ||type === "girls") query.type = type;

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
    res.status(500).json({ success: false, message: "Failed to fetch hostels", error: err.message });
  }
};

// // Example backend controller
// exports.getHostels = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = "", type, minRent, maxRent, services } = req.query;

//     const query = {};

//     // Search (name or address)
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { "address.full": { $regex: search, $options: "i" } }
//       ];
//     }

//     // Gender/Type filter
//     if (type && type !== "all") {
//       query.type = type;
//     }

//     // Rent filter
//     if (minRent || maxRent) {
//       query.rent = {};
//       if (minRent) query.rent.$gte = Number(minRent);
//       if (maxRent) query.rent.$lte = Number(maxRent);
//     }

//     // Services filter (must include all chosen services)
//     if (services && services.length > 0) {
//       query.services = { $all: services };
//     }

//     const hostels = await Hostel.find(query)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Hostel.countDocuments(query);

//     res.json({
//       data: hostels,
//       pagination: {
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching hostels", error });
//   }
// };
