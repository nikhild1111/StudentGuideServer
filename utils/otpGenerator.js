const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp");

const generateUniqueOTP = async () => {
  let otp;
  let isUnique = false;

  while (!isUnique) {
    // Generate 6-digit OTP
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Check if OTP already exists
    const existingOTP = await OTP.findOne({ otp });
    if (!existingOTP) {
      isUnique = true;
    }
  }

  return otp;
};

module.exports = generateUniqueOTP;
