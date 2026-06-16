const User = require("../models/userSchema");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const otpSchema = require("../models/otpSchema");
const bcrypt = require("bcrypt");


const registerController = async (req, res) => {
  console.log(req.body)
  try {
    let { name, email, password, otp } = req.body;
    
    name = name?.trim();
    email = email?.trim().toLowerCase();
    otp = otp?.trim(); 
    // basic fied validation
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if uset already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path); 
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // otp Verification Step
    try {
      // find the most recent record using findOne
      const otpRecord = await otpSchema.findOne({ email });

      if (!otpRecord) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "OTP expired or was never requested.",
        });
      }

      // check if the submitted token matches  in the database
      if (otpRecord.otp !== otp) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Invalid OTP token.",
        });
      }

    } catch (err) {
      console.error("Database error during OTP verification:", err);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ success: false, message: "Security check failed." });
    }

    // cloudinary profile picture upload
    let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjxaG6P_ydF7IcWPNq86sPZxUyuCEDA2U5TQ&s";
    
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
      } catch (err) {
        console.log("Cloudinary upload failed:", err);
      } finally {
        if(req.file)fs.unlinkSync(req.file.path);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
      profile: imageUrl,
    });

    await newUser.save();

    await otpSchema.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Global Exception Error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

module.exports = registerController;