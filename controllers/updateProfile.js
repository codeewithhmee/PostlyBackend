const User = require("../models/userSchema");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  try {
    let name = req.body?.name;
    let password = req.body?.password;
    name = name?.trim();
    password = password?.trim();


    if (!name || name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 3 characters",
      });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters",
      });
    }

    const updates = {};
    if (name) updates.name = name;

    if (password) {
      updates.password = await bcrypt.hash(password, 10); 
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        });
        updates.profile = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      } finally {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = updateUser;
