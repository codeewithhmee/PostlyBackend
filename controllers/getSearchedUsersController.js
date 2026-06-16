const User = require('../models/userSchema');

const getSearchedUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user_name = req.query.userName;
    try {
        const filter = {};
        if (user_name) filter.name = { $regex: user_name, $options: "i" }; 

        const total = await User.countDocuments(filter);
        const allusers = await User.find(filter)
            .select("-password") 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            ;

        return res.status(200).json({
            users: allusers,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error Fetching Users'
        });
    }
};

module.exports = getSearchedUsers;