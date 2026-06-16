const Blog = require("../models/blogSchema");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const updateBlog = async (req, res) => {
  console.log(req.body);
  const userId = req.user.id;

  const blogId = req.params.blogId;
  const { title, category, content } = req.body;
  if (!title?.trim() || !category?.trim() || !content?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    console.log("blog author",blog.author)
    console.log("user id",userId)


    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }
    blog.title = title;
    blog.category = category;
    blog.content = content;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        blog.image = result.secure_url;
      } catch (err) {
        console.log("Cloudinary upload failed:", err);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      } finally {
        if(req.file)fs.unlinkSync(req.file.path);
      }
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating blog",
    });
  }
};

module.exports = updateBlog;
