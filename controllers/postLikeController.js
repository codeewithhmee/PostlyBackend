const LikeSchema = require("../models/likeSchema");
const Blog = require("../models/blogSchema");

const like = async (req, res) => {
  const user_id = req.user.id;
  const blog_id = req.body.blogId;

  try {
    if (!blog_id) return res.status(400).json({ message: "Blog ID is required" })
    const document = await LikeSchema.findOne({ author: user_id, blog: blog_id });
    if (!document) {
      await LikeSchema.create({ author: user_id, blog: blog_id });
      await Blog.findByIdAndUpdate(blog_id, { $inc: { likes: 1 } });
      return res.status(200).json({ success: true, isLiked: true, message: "Successfully Liked" });
    }

    await document.deleteOne();
    await Blog.findByIdAndUpdate(blog_id, { $inc: { likes: -1 } }); 
    return res.status(200).json({ success: true, isLiked: false, message: "Successfully Unliked" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to toggle like" });
  }
};

module.exports = like;