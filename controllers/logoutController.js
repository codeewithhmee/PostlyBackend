const logoutController = async (req, res) => {
  try {
    
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0), 
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ success: false, message: "Server error during logout." });
  }
};

module.exports = logoutController ;