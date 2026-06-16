const generateOtp = require("../myFun/getRandomVal");
const otpSchema = require("../models/otpSchema");

const otp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required to request an OTP." });
    }
    const otp_value = generateOtp();

    try {
      await otpSchema.deleteMany({ email: email });
      const otp_v = new otpSchema({ email: email, otp: otp_value });
      const savedResponse = await otp_v.save(); 
      console.log("New OTP saved to DB:", savedResponse.otp);
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Error in database.." });
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Lost & Found", email: "samirbhandari1231@gmail.com" },
        to: [{ email: email }],
        subject: "OTP for Blog App",
        textContent: `Your OTP is: ${otp_value}. It expires in 5 minutes.`,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Brevo API error:", err);
      return res.status(500).json({ message: "Failed to deliver OTP email." });
    }

    return res.status(200).json({
      message: "OTP has been successfully sent to your email.",
    });

  } catch (error) {
    console.error("Unhandled global exception:", error);
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};

module.exports = otp;