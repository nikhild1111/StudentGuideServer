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

// Define the uploads folder path
const uploadPath = path.join(__dirname, "../public/uploads");

// Ensure the uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// File type filter for image and PDF
const fileFilter = (req, file, cb) => {
const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const resumeTypes = ["application/pdf"];

if (
  (["image", "images"].includes(file.fieldname) && imageTypes.includes(file.mimetype)) ||
  (file.fieldname === "resume" && resumeTypes.includes(file.mimetype))
)
 {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, PNG, JPG allowed for image and PDF allowed for resume")
    );
  }
};



// Multer upload instance
const upload = multer({ storage, fileFilter });

module.exports = upload;

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Define base uploads path
// const baseUploadPath = path.join(__dirname, "../public/uploads");

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let subfolder = "others";

//     if (["image", "images"].includes(file.fieldname)) {
//       subfolder = "images";
//     } else if (file.fieldname === "resume") {
//       subfolder = "resumes";
//     } else if (file.fieldname === "menu") {
//       subfolder = "menus";
//     }

//     const finalPath = path.join(baseUploadPath, subfolder);

//     // Create the folder if it doesn't exist
//     if (!fs.existsSync(finalPath)) {
//       fs.mkdirSync(finalPath, { recursive: true });
//     }

//     cb(null, finalPath);
//   },

//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, filename);
//   },
// });

// // File filter to allow images and PDFs
// const fileFilter = (req, file, cb) => {
//   const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   const resumeTypes = ["application/pdf"];

//   if (
//     (["image", "images"].includes(file.fieldname) && imageTypes.includes(file.mimetype)) ||
//     (file.fieldname === "resume" && resumeTypes.includes(file.mimetype))
//   ) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Only JPEG, PNG, JPG allowed for images and PDF allowed for resume")
//     );
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;






// router.post('/submit-resume', upload.single('resume'), async (req, res) => {
//   const resumePath = `/uploads/resumes/${req.file.filename}`;
//   // Save path to DB if needed
//   res.status(200).json({ success: true, path: resumePath });
// });






// /public/uploads/
// ├── images/
// │   └── photo1.jpg
// ├── resumes/
// │   └── resume1.pdf
// └── menus/
//     └── menu1.png
