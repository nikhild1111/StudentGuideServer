// # College Helper Website - MERN Stack Project Plan

// ## Project Overview
// A comprehensive platform to help new college students find accommodation, food, books, and other essential services from seniors and local vendors.

// ## Tech Stack
// - **Frontend**: React.js with React Router
// - **Backend**: Node.js with Express.js
// - **Database**: MongoDB with Mongoose
// - **Authentication**: JWT with email verification
// - **Additional**: Nodemailer for email, Cloudinary for images, Google Maps API for location

// ## Database Schema Design

// ### 1. User Schema
// ```javascript
// {
//   _id: ObjectId,
//   name: String,
//   email: String (unique),
//   password: String (hashed),
//   role: String (enum: ['student', 'admin', 'vendor']),
//   department: String,
//   year: Number,
//   phoneNumber: String,
//   isVerified: Boolean,
//   verificationToken: String,
//   profileImage: String,
//   createdAt: Date,
//   updatedAt: Date
// }
// ```

// ### 2. Hostel Schema
// ```javascript
// {
//   _id: ObjectId,
//   name: String,
//   type: String (enum: ['boys', 'girls']),
//   address: {
//     street: String,
//     area: String,
//     city: String,
//     pincode: String,
//     coordinates: {
//       lat: Number,
//       lng: Number
//     }
//   },
//   contactInfo: {
//     phone: String,
//     email: String,
//     ownerName: String
//   },
//   amenities: [String],
//   pricing: {
//     monthly: Number,
//     security: Number,
//     additional: String
//   },
//   images: [String],
//   availability: Boolean,
//   rating: Number,
//   reviews: [{
//     user: ObjectId (ref: User),
//     rating: Number,
//     comment: String,
//     date: Date
//   }],
//   createdBy: ObjectId (ref: User),
//   createdAt: Date
// }
// ```

// ### 3. Mess Schema
// ```javascript
// {
//   _id: ObjectId,
//   name: String,
//   address: {
//     street: String,
//     area: String,
//     city: String,
//     coordinates: {
//       lat: Number,
//       lng: Number
//     }
//   },
//   contactInfo: {
//     phone: String,
//     ownerName: String
//   },
//   menuItems: [{
//     category: String,
//     items: [{
//       name: String,
//       price: Number,
//       description: String,
//       isVeg: Boolean
//     }]
//   }],
//   timings: {
//     breakfast: String,
//     lunch: String,
//     dinner: String
//   },
//   pricing: {
//     monthly: Number,
//     daily: Number
//   },
//   images: [String],
//   rating: Number,
//   reviews: [{
//     user: ObjectId (ref: User),
//     rating: Number,
//     comment: String,
//     date: Date
//   }],
//   createdBy: ObjectId (ref: User),
//   createdAt: Date
// }
// ```

// ### 4. Books Schema
// ```javascript
// {
//   _id: ObjectId,
//   title: String,
//   author: String,
//   department: String,
//   semester: Number,
//   subject: String,
//   condition: String (enum: ['new', 'good', 'fair', 'poor']),
//   price: Number,
//   originalPrice: Number,
//   description: String,
//   images: [String],
//   seller: ObjectId (ref: User),
//   availability: Boolean,
//   contactInfo: {
//     phone: String,
//     email: String
//   },
//   createdAt: Date
// }
// ```

// ### 5. FAQ Schema
// ```javascript
// {
//   _id: ObjectId,
//   question: String,
//   answer: String,
//   category: String (enum: ['hostel', 'mess', 'books', 'general', 'placement']),
//   tags: [String],
//   askedBy: ObjectId (ref: User),
//   answeredBy: ObjectId (ref: User),
//   votes: {
//     upvotes: Number,
//     downvotes: Number
//   },
//   createdAt: Date
// }
// ```

// ### 6. Lost & Found Schema
// ```javascript
// {
//   _id: ObjectId,
//   type: String (enum: ['lost', 'found']),
//   itemName: String,
//   description: String,
//   category: String,
//   location: String,
//   date: Date,
//   images: [String],
//   contactInfo: {
//     phone: String,
//     email: String
//   },
//   user: ObjectId (ref: User),
//   status: String (enum: ['active', 'resolved']),
//   createdAt: Date
// }
// ```

// ### 7. Placement Schema
// ```javascript
// {
//   _id: ObjectId,
//   company: String,
//   position: String,
//   package: String,
//   eligibility: {
//     cgpa: Number,
//     departments: [String],
//     skills: [String]
//   },
//   questions: [{
//     round: String,
//     question: String,
//     answer: String,
//     difficulty: String
//   }],
//   tips: String,
//   contactPerson: ObjectId (ref: User),
//   createdAt: Date
// }
// ```

// ### 8. College Info Schema
// ```javascript
// {
//   _id: ObjectId,
//   name: String,
//   address: String,
//   departments: [String],
//   facilities: [String],
//   contactInfo: {
//     phone: String,
//     email: String,
//     website: String
//   },
//   importantPlaces: [{
//     name: String,
//     description: String,
//     coordinates: {
//       lat: Number,
//       lng: Number
//     }
//   }]
// }
// ```

// ## Frontend Structure

// ### Page Flow and Components

// #### 1. Landing Page (`/`)
// - College information
// - Hero section with search
// - Featured services preview
// - Quick access buttons
// - FAQ section

// #### 2. Authentication Pages
// - `/login` - Login form
// - `/register` - Registration with email verification
// - `/verify-email/:token` - Email verification
// - `/forgot-password` - Password reset

// #### 3. Main Service Pages
// - `/hostels` - Hostel listings with filters
// - `/hostels/:id` - Individual hostel details
// - `/mess` - Mess listings with filters
// - `/mess/:id` - Individual mess details
// - `/books` - Book marketplace
// - `/books/:id` - Individual book details
// - `/books/sell` - Sell books form

// #### 4. Community Features
// - `/faq` - Frequently asked questions
// - `/lost-found` - Lost and found items
// - `/placement` - Placement preparation

// #### 5. User Dashboard
// - `/dashboard` - User profile and activity
// - `/my-listings` - User's posted items
// - `/favorites` - Saved items

// ## Backend API Routes

// ### Authentication Routes (`/api/auth`)
// ```
// POST /register - User registration
// POST /login - User login
// POST /verify-email - Email verification
// POST /forgot-password - Password reset request
// POST /reset-password - Password reset
// GET /profile - Get user profile
// PUT /profile - Update user profile
// ```

// ### Hostel Routes (`/api/hostels`)
// ```
// GET / - Get all hostels (with pagination and filters)
// GET /:id - Get specific hostel
// POST / - Create new hostel (authenticated)
// PUT /:id - Update hostel (owner only)
// DELETE /:id - Delete hostel (owner/admin only)
// POST /:id/review - Add review
// GET /search - Search hostels by location/name
// ```

// ### Mess Routes (`/api/mess`)
// ```
// GET / - Get all mess (with pagination and filters)
// GET /:id - Get specific mess
// POST / - Create new mess (authenticated)
// PUT /:id - Update mess (owner only)
// DELETE /:id - Delete mess (owner/admin only)
// POST /:id/review - Add review
// ```

// ### Books Routes (`/api/books`)
// ```
// GET / - Get all books (with filters)
// GET /:id - Get specific book
// POST / - Create new book listing (authenticated)
// PUT /:id - Update book (owner only)
// DELETE /:id - Delete book (owner only)
// GET /search - Search books by title/author/department
// ```

// ### FAQ Routes (`/api/faq`)
// ```
// GET / - Get all FAQs
// GET /:id - Get specific FAQ
// POST / - Create new FAQ (authenticated)
// PUT /:id - Update FAQ (admin only)
// DELETE /:id - Delete FAQ (admin only)
// POST /:id/vote - Vote on FAQ
// ```

// ### Lost & Found Routes (`/api/lost-found`)
// ```
// GET / - Get all lost & found items
// GET /:id - Get specific item
// POST / - Create new item (authenticated)
// PUT /:id - Update item (owner only)
// DELETE /:id - Delete item (owner only)
// ```

// ### Placement Routes (`/api/placement`)
// ```
// GET / - Get all placement info
// GET /:id - Get specific placement info
// POST / - Create new placement info (authenticated)
// PUT /:id - Update placement info (owner only)
// ```

// ## Key Features Implementation

// ### 1. Email Verification System
// - Use Nodemailer with Gmail SMTP
// - Generate unique verification tokens
// - Store tokens in database with expiration
// - Send verification emails on registration

// ### 2. Location Integration
// - Google Maps API for location display
// - Geolocation for nearby suggestions
// - Distance calculation between user and services

// ### 3. Search & Filter System
// - MongoDB text search for books and services
// - Filter by price, location, rating, department
// - Sorting options (price, rating, distance)

// ### 4. Image Upload System
// - Cloudinary for image storage
// - Image compression and optimization
// - Multiple image support for listings

// ### 5. Rating & Review System
// - 5-star rating system
// - Written reviews with moderation
// - Average rating calculation

// ## Development Phases

// ### Phase 1: Core Setup
// 1. Set up MERN stack environment
// 2. Create basic authentication system
// 3. Design and implement database schemas
// 4. Create basic UI components

// ### Phase 2: Core Features
// 1. Implement hostel and mess listings
// 2. Add book marketplace
// 3. Create user dashboard
// 4. Implement search and filters

// ### Phase 3: Advanced Features
// 1. Add location services
// 2. Implement email verification
// 3. Create FAQ system
// 4. Add lost & found feature

// ### Phase 4: Enhancement
// 1. Add placement preparation section
// 2. Implement rating and review system
// 3. Add image upload functionality
// 4. Mobile responsiveness

// ### Phase 5: Testing & Deployment
// 1. Unit and integration testing
// 2. Performance optimization
// 3. Security audit
// 4. Deployment to cloud platform

// ## Folder Structure

// ```
// college-helper/
// ├── client/
// │   ├── public/
// │   ├── src/
// │   │   ├── components/
// │   │   ├── pages/
// │   │   ├── hooks/
// │   │   ├── context/
// │   │   ├── utils/
// │   │   └── styles/
// │   └── package.json
// ├── server/
// │   ├── controllers/
// │   ├── models/
// │   ├── routes/
// │   ├── middleware/
// │   ├── utils/
// │   ├── config/
// │   └── server.js
// ├── README.md
// └── package.json
// ```

// This structure provides a solid foundation for your college helper website with proper schema design, clear API routes, and a logical development flow.
















// // ===========================================
// // 📁 PROJECT STRUCTURE
// // ===========================================
// /*
// backend/
// ├── config/
// │   └── database.js
// ├── controllers/
// │   └── authController.js
// ├── middleware/
// │   └── auth.js
// ├── models/
// │   ├── User.js
// │   └── OTP.js
// ├── routes/
// │   └── auth.js
// ├── utils/
// │   ├── mailSender.js
// │   └── otpGenerator.js
// ├── templates/
// │   └── emailTemplate.js
// ├── .env
// ├── server.js
// └── package.json
// */

// // ===========================================
// // 📁 /models/User.js - User Schema
// // ===========================================
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     maxLength: 50,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 6,
//   },
//   role: {
//     type: String,
//     enum: ['student', 'admin', 'vendor'],
//     default: 'student',
//     required: true,
//   },
//   department: {
//     type: String,
//     required: function() {
//       return this.role === 'student';
//     },
//     trim: true,
//   },
//   year: {
//     type: Number,
//     required: function() {
//       return this.role === 'student';
//     },
//     min: 1,
//     max: 4,
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   profileImage: {
//     type: String,
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Index for better performance
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1 });

// module.exports = mongoose.model("User", userSchema);

// // ===========================================
// // 📁 /models/OTP.js - OTP Schema
// // ===========================================
// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../templates/emailTemplate");

// const otpSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//   },
//   otp: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 300, // OTP expires in 5 minutes
//   },
// });

// // Pre-save hook to send OTP email
// otpSchema.pre("save", async function(next) {
//   if (this.isNew) {
//     try {
//       const emailBody = emailTemplate.otpTemplate(this.otp);
//       await mailSender(
//         this.email,
//         "StudentHub - Email Verification OTP",
//         `Your OTP for StudentHub verification is: ${this.otp}`,
//         emailBody
//       );
//       console.log(`✅ OTP sent successfully to ${this.email}`);
//     } catch (error) {
//       console.error("❌ Error sending OTP email:", error);
//       throw new Error("Failed to send OTP email");
//     }
//   }
//   next();
// });

// module.exports = mongoose.model("OTP", otpSchema);

// // ===========================================
// // 📁 /utils/mailSender.js - Email Utility
// // ===========================================
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (to, subject, text, html = null) => {
//   try {
//     // Create transporter for StudentHub
//     const transporter = nodemailer.createTransporter({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: `"StudentHub" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     };

//     // Add HTML if provided
//     if (html) {
//       mailOptions.html = html;
//     }

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email successfully sent to ${to}`);
    
//     return info;
//   } catch (error) {
//     console.error("❌ Error sending mail:", error.message);
//     throw error;
//   }
// };

// module.exports = mailSender;

// // ===========================================
// // 📁 /utils/otpGenerator.js - OTP Generator
// // ===========================================
// const otpGenerator = require("otp-generator");
// const OTP = require("../models/OTP");

// const generateUniqueOTP = async () => {
//   let otp;
//   let isUnique = false;

//   while (!isUnique) {
//     // Generate 6-digit OTP
//     otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     // Check if OTP already exists
//     const existingOTP = await OTP.findOne({ otp });
//     if (!existingOTP) {
//       isUnique = true;
//     }
//   }

//   return otp;
// };

// module.exports = generateUniqueOTP;

// // ===========================================
// // 📁 /templates/emailTemplate.js - Email Templates
// // ===========================================
// const emailTemplate = {
//   otpTemplate: (otp) => {
//     return `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>StudentHub - Email Verification</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//           .otp-box { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
//           .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
//           .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>🎓 StudentHub</h1>
//             <p>Email Verification Required</p>
//           </div>
//           <div class="content">
//             <h2>Welcome to StudentHub!</h2>
//             <p>Thank you for joining our student community. To complete your registration, please verify your email address using the OTP below:</p>
            
//             <div class="otp-box">
//               <p>Your Verification Code:</p>
//               <div class="otp-code">${otp}</div>
//               <p><small>This code expires in 5 minutes</small></p>
//             </div>
            
//             <p>If you didn't create an account with StudentHub, please ignore this email.</p>
            
//             <div class="footer">
//               <p>© 2025 StudentHub - Connecting Students, Empowering Learning</p>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   },

//   welcomeTemplate: (name) => {
//     return `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Welcome to StudentHub</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
//           .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 10px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>🎉 Welcome to StudentHub!</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>Your account has been successfully verified and activated.</p>
//             <p>You can now access all StudentHub features including:</p>
//             <ul>
//               <li>📚 Course materials and resources</li>
//               <li>👥 Connect with fellow students</li>
//               <li>🛍️ Campus marketplace</li>
//               <li>📅 Event notifications</li>
//             </ul>
//             <p>Happy learning!</p>
//             <p><strong>The StudentHub Team</strong></p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }
// };

// module.exports = emailTemplate;

// // ===========================================
// // 📁 /middleware/auth.js - Authentication Middleware
// // ===========================================
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Authentication middleware
// const auth = async (req, res, next) => {
//   try {
//     // Extract JWT token
//     const token = req.cookies.token || 
//                   req.body.token || 
//                   req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token is missing or invalid",
//       });
//     }

//     try {
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(401).json({
//       success: false,
//       message: "Something went wrong while validating the token",
//     });
//   }
// };

// // Authorization middleware for specific roles
// const authorize = (...roles) => {
//   return async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user.id);
      
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       if (!roles.includes(user.role)) {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied. Insufficient permissions.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Authorization error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Error in authorization",
//       });
//     }
//   };
// };

// module.exports = { auth, authorize };

// // ===========================================
// // 📁 /controllers/authController.js - Auth Controllers
// // ===========================================
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const OTP = require("../models/OTP");
// const generateUniqueOTP = require("../utils/otpGenerator");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../templates/emailTemplate");

// // Send OTP for email verification
// const sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Validate email
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     // Generate unique OTP
//     const otp = await generateUniqueOTP();

//     // Save OTP to database (will trigger email sending via pre-save hook)
//     const otpDocument = new OTP({ email, otp });
//     await otpDocument.save();

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully to your email",
//     });

//   } catch (error) {
//     console.error("Send OTP Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//       error: error.message,
//     });
//   }
// };

// // Sign up user
// const signUp = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role = 'student',
//       department,
//       year,
//       phoneNumber,
//       otp,
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !password || !phoneNumber || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be filled",
//       });
//     }

//     // Validate student-specific fields
//     if (role === 'student' && (!department || !year)) {
//       return res.status(400).json({
//         success: false,
//         message: "Department and year are required for students",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     // Verify OTP
//     const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
//     if (!recentOTP || recentOTP.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const userData = {
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       phoneNumber,
//       isVerified: true,
//     };

//     // Add student-specific fields
//     if (role === 'student') {
//       userData.department = department;
//       userData.year = year;
//     }

//     const user = await User.create(userData);

//     // Send welcome email
//     try {
//       const welcomeEmailBody = emailTemplate.welcomeTemplate(name);
//       await mailSender(
//         email,
//         "Welcome to StudentHub!",
//         `Welcome to StudentHub, ${name}! Your account has been successfully created.`,
//         welcomeEmailBody
//       );
//     } catch (emailError) {
//       console.error("Welcome email error:", emailError);
//       // Don't fail signup if email fails
//     }

//     // Clean up OTP
//     await OTP.deleteMany({ email });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department,
//         year: user.year,
//         phoneNumber: user.phoneNumber,
//         isVerified: user.isVerified,
//       },
//     });

//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// };

// // Login user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Check if user is verified
//     if (!user.isVerified) {
//       return res.status(401).json({
//         success: false,
//         message: "Please verify your email before logging in",
//       });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Generate JWT token
//     const payload = {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Set cookie
//     const options = {
//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     };

//     res.cookie("token", token, options).status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department,
//         year: user.year,
//         phoneNumber: user.phoneNumber,
//         profileImage: user.profileImage,
//         isVerified: user.isVerified,
//       },
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//       error: error.message,
//     });
//   }
// };

// // Get user profile
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });

//   } catch (error) {
//     console.error("Get Profile Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: error.message,
//     });
//   }
// };

// // Update user profile
// const updateProfile = async (req, res) => {
//   try {
//     const { name, phoneNumber, department, year } = req.body;
//     const userId = req.user.id;

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (phoneNumber) updateData.phoneNumber = phoneNumber;
    
//     // Only allow students to update department and year
//     const user = await User.findById(userId);
//     if (user.role === 'student') {
//       if (department) updateData.department = department;
//       if (year) updateData.year = year;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updateData,
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });

//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile",
//       error: error.message,
//     });
//   }
// };

// // Change password
// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.user.id;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password and new password are required",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isCurrentPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     // Hash new password
//     const hashedNewPassword = await bcrypt.hash(newPassword, 12);

//     // Update password
//     await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });

//   } catch (error) {
//     console.error("Change Password Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to change password",
//       error: error.message,
//     });
//   }
// };

// // Logout user
// const logout = async (req, res) => {
//   try {
//     res.clearCookie("token").status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Logout failed",
//       error: error.message,
//     });
//   }
// };

// // Admin: Get all users
// const getAllUsers = async (req, res) => {
//   try {
//     const { role, department, page = 1, limit = 10 } = req.query;
    
//     const filter = {};
//     if (role) filter.role = role;
//     if (department) filter.department = department;

//     const users = await User.find(filter)
//       .select("-password")
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await User.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       users,
//       pagination: {
//         current: page,
//         pages: Math.ceil(total / limit),
//         total,
//       },
//     });

//   } catch (error) {
//     console.error("Get All Users Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   sendOTP,
//   signUp,
//   login,
//   getProfile,
//   updateProfile,
//   changePassword,
//   logout,
//   getAllUsers,
// };

// // ===========================================
// // 📁 /routes/auth.js - Auth Routes
// // ===========================================
// const express = require("express");
// const router = express.Router();
// const {
//   sendOTP,
//   signUp,
//   login,
//   getProfile,
//   updateProfile,
//   changePassword,
//   logout,
//   getAllUsers,
// } = require("../controllers/authController");
// const { auth, authorize } = require("../middleware/auth");

// // Public routes (no authentication required)
// router.post("/send-otp", sendOTP);
// router.post("/signup", signUp);
// router.post("/login", login);

// // Protected routes (authentication required)
// router.get("/profile", auth, getProfile);
// router.put("/profile", auth, updateProfile);
// router.post("/change-password", auth, changePassword);
// router.post("/logout", auth, logout);

// // Admin-only routes
// router.get("/users", auth, authorize("admin"), getAllUsers);

// module.exports = router;

// // ===========================================
// // 📁 /config/database.js - Database Configuration
// // ===========================================
// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("🚀 Database connected successfully");
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// // ===========================================
// // 📁 /server.js - Main Server File
// // ===========================================
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
// require("dotenv").config();

// const connectDB = require("./config/database");
// const authRoutes = require("./routes/auth");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to database
// connectDB();

// // Middleware
// app.use(express.json({ limit: "16mb" }));
// app.use(express.urlencoded({ extended: true, limit: "16mb" }));
// app.use(cookieParser());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true,
// }));
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp/",
// }));

// // Routes
// app.use("/api/v1/auth", authRoutes);

// // Health check route
// app.get("/api/v1/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "StudentHub API is running!",
//     timestamp: new Date().toISOString(),
//   });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Global error handler
// app.use((error, req, res, next) => {
//   console.error("Global Error:", error);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     error: process.env.NODE_ENV === "development" ? error.message : undefined,
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🌟 StudentHub server running on port ${PORT}`);
// });

// // ===========================================
// // 📁 /.env - Environment Variables (EXAMPLE)
// // ===========================================
// /*
// # Database
// MONGODB_URL=mongodb://localhost:27017/studenthub

// # JWT
// JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

// # Email Configuration
// EMAIL_USER=your_gmail@gmail.com
// EMAIL_PASS=your_app_password_here

// # Server
// PORT=5000
// NODE_ENV=development
// FRONTEND_URL=http://localhost:3000
// */

// // ===========================================
// // 📁 /package.json - Dependencies
// // ===========================================
// /*
// {
//   "name": "studenthub-backend",
//   "version": "1.0.0",
//   "description": "Backend API for StudentHub application",
//   "main": "server.js",
//   "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   },
//   "dependencies": {
//     "express": "^4.18.2",
//     "mongoose": "^7.5.0",
//     "bcryptjs": "^2.4.3",
//     "jsonwebtoken": "^9.0.2",
//     "nodemailer": "^6.9.4",
//     "otp-generator": "^4.0.1",
//     "cors": "^2.8.5",
//     "cookie-parser": "^1.4.6",
//     "express-fileupload": "^1.4.0",
//     "dotenv": "^16.3.1"
//   },
//   "devDependencies": {
//     "nodemon": "^3.0.1"
//   }
// }
// */

// // ===========================================
// // 🔧 INSTALLATION & SETUP INSTRUCTIONS
// // ===========================================
// /*
// 1. Create project folder:
//    mkdir studenthub-backend && cd studenthub-backend

// 2. Initialize npm:
//    npm init -y

// 3. Install dependencies:
//    npm install express mongoose bcryptjs jsonwebtoken nodemailer otp-generator cors cookie-parser express-fileupload dotenv

// 4. Install dev dependencies:
//    npm install -D nodemon

// 5. Create the folder structure as shown above

// 6. Set up Gmail App Password:
//    - Go to Google Account settings
//    - Enable 2-factor authentication
//    - Generate an app password for nodemailer
//    - Use this password in EMAIL_PASS

// 7. Create .env file with your configuration

// 8. Run the application:
//    npm run dev

// 9. Test the API endpoints using Postman or your frontend

// API Endpoints:
// - POST /api/v1/auth/send-otp - Send OTP to email
// - POST /api/v1/auth/signup - Register new user
// - POST /api/v1/auth/login - Login user
// - GET /api/v1/auth/profile - Get user profile (protected)
// - PUT /api/v1/auth/profile - Update profile (protected)
// - POST /api/v1/auth/change-password - Change password (protected)
// - POST /api/v1/auth/logout - Logout user (protected)
// - GET /api/v1/auth/users - Get all users (admin only)
// */