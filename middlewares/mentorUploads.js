const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const { rawListeners } = require("../models/Mentor");



const storage = new CloudinaryStorage({
 
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {

   
      folder: "mentor_uploads", // Folder in your Cloudinary
      resource_type: "auto", // Handles both images and PDFs
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
