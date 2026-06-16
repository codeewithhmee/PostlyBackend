const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password incorrect" });
    }

    // syntax: jwt.sign(payload, secretKey, options)
    const token = jwt.sign(
      { id: user._id, email: email, name: user.name, avatar: user.profile }, // in jwt id is must to make work easier
      process.env.MY_JWT_KEY,
      { expiresIn: "10d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login Sucessfull", avatar: user.profile });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Database error.." });
  }
};

module.exports = loginController;