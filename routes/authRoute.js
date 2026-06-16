const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
//controllers
const registerController=require('../controllers/register')
const loginController=require('../controllers/login')
const getMe=require('../controllers/me')
const otpReq=require('../controllers/handleOTPReq')
const logout=require('../controllers/logoutController')
//middleware
const upload = require('../middleware/upload');

//1.register route
router.post("/register",upload.single('profilePic'),registerController);
//2.login route
router.post("/login", loginController);
//3.getme route
router.get('/me',getMe )
//4.otp
router.post('/otp',otpReq)
//5.logout
router.post('/logout', getMe,logout);


module.exports = router;
