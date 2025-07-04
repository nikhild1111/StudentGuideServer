const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");
const generateUniqueOTP = require("../utils/otpGenerator");
const mailSender = require("../utils/mailSender");




exports.Signup = async (req, res) => {
  try {

   
    const {
      name,
      email,
      password,
      role,
      department,
      year,
      phone,
      gender,
      college
    } = req.body;


    
    // 1. Check if user already exists
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please use a new email.",
      });
    }

    // 2. Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }

    // 3. Create new user
    const newUser = await User.create({
      name,
      college,
      gender,
      email,
      password: hashedPassword,
      role,
      department: role === "student" ? department : undefined,
      year: role === "student" ? year : undefined,
      phone,
    });

    // 4. Create payload for JWT
    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      department:newUser.department,
      year:newUser.year,
      college:newUser.college,
        gender:newUser.gender,
    };

    // 5. Sign JWT token
    const token = jwt.sign(payload, "LASTCHANSE", { expiresIn: "2h" });
    payload.token = token;

    // 6. Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "None", // Allow cross-origin
      secure: true,     // Must be HTTPS in production
    };

    // 7. Send response with cookie
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      payload,
      message: "User signup and login successful",
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};





exports.Login=async(req,res)=>{
try{
    const {email,password}=req.body;

    if(!email|| !password){
        return res.status(400).json({
            success:false,
            message:"Please fill  all the details carefully ",
        })
    }


    const user=await User.findOne({email});
    if(!user){
 return res.status(400).json({
    success:false,
    message:"Email is not exist plase signup first "
})
    }

    // if user exist check password if password match create token
     // 3. Check password
     const isPasswordMatch = await bcrypt.compare(password, user.password);
     if (!isPasswordMatch) {
        return res.status(403).json({
          success: false,
          message: "Invalid password",
        });
      }
// as we want to create the token first difnd the payload (data) whcih we want in that token
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department:user.department,
      year:user.year,
      college:user.college,
    };

// LASTCHANSE its a secret key as our process.env is not working
let token=jwt.sign(payload,"LASTCHANSE",{
    expiresIn:"2h",
})

// imp you can send the toekn in the header or in the response body or in the cookis

// we are doing the cookis and the response

// this will set the expiry of cookes after that it will not work
payload.token=token;

const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'None',  // ✅ Allow cross-origin (Vercel <-> Render)
    secure: true       // ✅ Required in production with HTTPS
  };
  
  res.cookie("token", token, options).status(200).json({
    success: true,
    token,
    payload,
    message: "User Login Done",
  });
    


}catch(err){
    console.error("Login error:", err); // Helpful in debugging
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
}
}






exports.sendOtp = async (req, res) => {

    console.log(req.body,"         the                   ");
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Use Login or try another Email.",
      });
    }

    const otp = await generateUniqueOTP();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await mailSender(
      email,
      "Verify your Email",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// @desc    Verify the OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await Otp.deleteOne({ _id: record._id });
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};







