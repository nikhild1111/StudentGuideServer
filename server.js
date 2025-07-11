const express=require("express");
const app=express();
require("dotenv").config();
const {dbConnect}=require("./config/database")
const PORT=process.env.PORT||4000;
const path = require('path');
const cookieParser=require("cookie-parser")
const { auth, isAdmin } = require("./middlewares/auth");
const cors = require('cors'); //must add this request when send request from one port to other cors is important


// Allow requests from your frontend

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // ✅ Add this
  'https://vercel-frontend-nine-chi.vercel.app','https://studentguideclient.onrender.com'
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
credentials: true, // ✅ allow cookies
}));



// Add this line to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-data
// this is cookie parser
app.use(cookieParser());

// Serve static files in /public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve images
// impoe=rtant as the server is in backend file so used the nodemon Backend/server.js for use the nodemon


const authRoutes = require("./routes/auth");
app.use("/api/v1/auth", authRoutes);



// this will do connection with database
dbConnect();

// default route
app.get('/',(req,res)=>{
    res.send(`<h1>This was an default route 6<h1>`)
})

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`)
})
