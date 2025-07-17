// controllers/hotelController.js
const Hotel = require("../models/Hotel");
const fs = require("fs");
const path = require("path");


// ➕ Create Hotel
// ➕ Create Hotel
exports.createHotel = async (req, res) => {
  try {
    console.log(req.body); // For debugging

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const hotelData = {
      ...req.body,
      address: JSON.parse(req.body.address),  // ✅ Parse address
      menu: JSON.parse(req.body.menu),        // ✅ Already correct
      images: imagePaths
    };

    const hotel = new Hotel(hotelData);
    await hotel.save();

    res.status(201).json(
      
      
    {
success: true,
hotel,
    }  
    
    
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllHotels = async (req, res) => {
  const { page = 1, limit = 10, search = "", type } = req.body;

  const query = {
    ...(type && type !== "all" ? { type } : {}),
    ...(search ? { name: { $regex: search, $options: "i" } } : {}),
  };

  try {
    const hotels = await Hotel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Hotel.countDocuments(query);

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
      error: err.message,
    });
  }
};


// 🔍 Get One Hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📝 Update Hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    // Delete old images if requested
    if (req.body.deleteOldImages === "true" && hotel.images.length > 0) {
      hotel.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", "public", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Add new uploaded images
    let newImages = hotel.images;
    if (req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      newImages = req.body.deleteOldImages === "true" ? imagePaths : [...hotel.images, ...imagePaths];
    }

    const updatedData = {
      ...req.body,
      images: newImages,
      menu: req.body.menu ? JSON.parse(req.body.menu) : hotel.menu,
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.status(200).json(
      
      
      
         {
success: true,
 updatedHotel,
    }  
   );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete Hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    hotel.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", "public", imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({
         
success: true,
      message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
