const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");


const makeUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"], // add more if needed
    },
  });

  return multer({ storage });
};

module.exports = makeUploader;
