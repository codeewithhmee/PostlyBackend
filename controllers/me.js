const User=require('../models/userSchema')
const jwt = require('jsonwebtoken')
const getMe = (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, message: "Not logged in" })
        }
        const decoded = jwt.verify(token, process.env.MY_JWT_KEY)
        return res.status(200).json({ success: true, user: decoded })
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" })
    }
}
module.exports=getMe;
