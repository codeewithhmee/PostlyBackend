const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userSchema");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.MY_JWT_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // fetch user from DB
    const user = await User.findById(decoded.id).select("-password");

    // check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);

    return res.status(500).json({
      success: false,
      message: "Authentication system error",
    });
  }
};

module.exports = protect;