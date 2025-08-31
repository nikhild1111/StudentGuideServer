// // controllers/hotelController.js
// const Hotel = require("../models/Hotel");
// const fs = require("fs");
// const path = require("path");


// // ➕ Create Hotel
// // ➕ Create Hotel
// exports.createHotel = async (req, res) => {
//   try {
//     console.log(req.body); // For debugging

//     const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//     const hotelData = {
//       ...req.body,
//       address: JSON.parse(req.body.address),  // ✅ Parse address
//       menu: JSON.parse(req.body.menu),        // ✅ Already correct
//       images: imagePaths
//     };

//     const hotel = new Hotel(hotelData);
//     await hotel.save();

//     res.status(201).json(
      
      
//     {
// success: true,
// hotel,
//     }  
    
    
//     );
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


// exports.getAllHotels = async (req, res) => {
//   const { page = 1, limit = 10, search = "", type } = req.body;

//   const query = {
//     ...(type && type !== "all" ? { type } : {}),
//     ...(search ? { name: { $regex: search, $options: "i" } } : {}),
//   };

//   try {
//     const hotels = await Hotel.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const total = await Hotel.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: hotels,
//       pagination: {
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: Number(page),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };


// // 🔍 Get One Hotel by ID
// exports.getHotelById = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ error: "Hotel not found" });
//     res.status(200).json(hotel);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 📝 Update Hotel
// exports.updateHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ error: "Hotel not found" });

//     // Delete old images if requested
//     if (req.body.deleteOldImages === "true" && hotel.images.length > 0) {
//       hotel.images.forEach((imgPath) => {
//         const fullPath = path.join(__dirname, "..", "public", imgPath);
//         if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//       });
//     }

//     // Add new uploaded images
//     let newImages = hotel.images;
//     if (req.files.length > 0) {
//       const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
//       newImages = req.body.deleteOldImages === "true" ? imagePaths : [...hotel.images, ...imagePaths];
//     }

//     const updatedData = {
//       ...req.body,
//       images: newImages,
//       menu: req.body.menu ? JSON.parse(req.body.menu) : hotel.menu,
//     };

//     const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true,
//     });

//     res.status(200).json(
      
      
      
//          {
// success: true,
//  updatedHotel,
//     }  
//    );
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // ❌ Delete Hotel
// exports.deleteHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ error: "Hotel not found" });

//     hotel.images.forEach((imgPath) => {
//       const fullPath = path.join(__dirname, "..", "public", imgPath);
//       if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//     });

//     await Hotel.findByIdAndDelete(req.params.id);
//     res.status(200).json({
         
// success: true,
//       message: "Hotel deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };







// controllers/hotelController.js
const Hotel = require("../models/Hotel");
const cloudinary = require("../utils/cloudinary");

// ➕ Create Hotel
exports.createHotel = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ Parse JSON fields
    if (req.body.address) {
      data.address =
        typeof req.body.address === "string"
          ? JSON.parse(req.body.address)
          : req.body.address;
    }
    if (req.body.menu) {
      data.menu =
        typeof req.body.menu === "string"
          ? JSON.parse(req.body.menu)
          : req.body.menu;
    }

    // ✅ Handle Cloudinary images
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const hotel = await Hotel.create(data);

    res.status(201).json({
      success: true,
      message: "Hotel created",
      data: hotel,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create hotel",
      error: err.message,
    });
  }
};

// 📋 Get All Hotels (with filters + pagination)
exports.getAllHotels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type = "all" } = req.body;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (type && type !== "all") query.type = type;

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: hotels,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: err.message,
    });
  }
};

// 🔍 Get One Hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel)
      return res.status(404).json({ success: false, message: "Hotel not found" });

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
      error: err.message,
    });
  }
};

// 📝 Update Hotel
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Hotel.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Hotel not found" });

    let newImages = existing.images;

    // ✅ If new images are uploaded
    if (req.files && req.files.length > 0) {
      // ❌ Delete old Cloudinary images
      if (existing.images && existing.images.length > 0) {
        for (let img of existing.images) {
          await cloudinary.uploader.destroy(img.public_id).catch(() => {});
        }
      }

      // ✅ Save new Cloudinary images
      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // ✅ Parse JSON safely
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
      menu: parseIfNeeded(req.body.menu, existing.menu),
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Hotel updated",
      data: updatedHotel,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update hotel",
      error: err.message,
    });
  }
};

// ❌ Delete Hotel
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);

    if (!hotel)
      return res.status(404).json({ success: false, message: "Hotel not found" });

    // ❌ Delete Cloudinary images
    if (hotel.images && hotel.images.length > 0) {
      for (let img of hotel.images) {
        await cloudinary.uploader.destroy(img.public_id).catch(() => {});
      }
    }

    res.status(200).json({
      success: true,
      message: "Hotel deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hotel",
      error: err.message,
    });
  }
};
