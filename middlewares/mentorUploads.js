const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const { rawListeners } = require("../models/Mentor");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";
    if (file.mimetype === "application/pdf") {
      resourceType = "raw"; // force raw for PDFs
    }
    return {
      folder: "mentor_uploads",
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});
const upload = multer({ storage });

module.exports = upload;
