const Blog = require('../models/blogSchema');
const cloudinary = require('../utils/cloudinary');
const fs=require("fs");
const post_blog = async (req, res) => {
    const { id } = req.user;
    const { title, category, content } = req.body;

    if (!title?.trim() || !category?.trim() || !content?.trim()) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/4/42/Blog_%281%29.jpg";
       if (req.file) {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    } catch (err) {
        console.log("Cloudinary upload failed:", err);
    } finally {
        fs.unlinkSync(req.file.path); 
    }
}

        const blog = new Blog({ title, category, content, image: imageUrl, author: id });
        await blog.save();
        console.log(blog)
        return res.status(201).json({ success: true, message: "Blog posted successfully.." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while posting..." });
    }
};

module.exports = post_blog;