const Blog = require("../models/blogSchema");
const Like=require('../models/likeSchema');
const User = require('../models/userSchema');
const getUserBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
      const author = await User.findById(req.params.userid).select("name profile");
    if (!author) {
      return res.status(404).json({ message: "User not found" });
    }
    const total = await Blog.countDocuments({ author: req.params.userid });
    const allBlogs = await Blog.find({ author: req.params.userid })
      .select("title category image author createdAt likes")
      .populate("author", "name  profile")
    .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean(); //this make a just only normal js object .not a mongodb document anymore
    const blog_ids = allBlogs.map((blog) => blog._id); //we extract all blog id

    //now we get all blog where user liked blog among allblogs
    const userLikes = await Like.find({
      author: req.user.id,
      blog: { $in: blog_ids },
    }).select("blog");
    //now we put tthem in set  so to compare for our allBlogs if that blog exist in userLikes
    const likedSet = new Set(userLikes.map((l) => l.blog.toString()));
    //now we make a new object
    const blogs = allBlogs.map((blog) => ({
      ...blog,
      isLiked: likedSet.has(blog._id.toString()),
    }));
    return res.status(200).json({
      blogs: blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
       author: author 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Fetching Blogs",
    });
  }
};

module.exports = getUserBlogs;
