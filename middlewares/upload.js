// // middleware/upload.js
// const multer = require("multer");
// const path = require("path");

// // Define storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
//     cb(null, uniqueName);
//   },
// });

// // Filter image files only
// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];
//   cb(null, allowed.includes(file.mimetype));
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;



const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads folder exists
const uploadPath = "public/uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
