const Hostel = require("../models/Hostel");
const fs = require("fs");
const path = require("path");

// 🔸 Create Hostel
exports.createHostel = async (req, res) => {
  try {
    const {
      name,
      type,
      rent,
      rating,
      video,
      services,
      address,
      contact,
      description,
    } = req.body;

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // ✅ Parse JSON string fields
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    const parsedServices = typeof services === 'string' ? JSON.parse(services) : services;

    const hostel = await Hostel.create({
      name,
      type,
      rent,
      rating,
      images: imagePaths,
      video,
      services: parsedServices,
      address: parsedAddress,
      contact,
      description,
    });

    res.status(201).json({ success: true, message: "Hostel added", data: hostel });
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
    if (!existing) return res.status(404).json({ success: false, message: "Hostel not found" });

    // Delete old images if new ones are uploaded
    if (req.files.length > 0 && existing.images.length > 0) {
      existing.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", "public", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    const updatedFields = {
      ...req.body,
      images: req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : existing.images,

      // ✅ Parse JSON string if present
      address: req.body.address
        ? JSON.parse(req.body.address)
        : existing.address,

      services: req.body.services
        ? JSON.parse(req.body.services)
        : existing.services,
    };

    const updated = await Hostel.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ success: true, message: "Hostel updated", data: updated });
  } catch (err) {
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

    if (type !== "all") query.type = type;

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
