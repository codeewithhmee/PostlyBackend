const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true 
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // mongodb will auto-delete this document after 300
  }
}, { timestamps: true }); 

module.exports = mongoose.model("Otp", otpSchema);