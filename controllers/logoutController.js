const logoutController = async (req, res) => {
  try {
    // clearCookie automatically overwrites the value and expires it
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,      
        sameSite: "none", 
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

module.exports = logoutController;