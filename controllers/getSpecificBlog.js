const Blog = require("../models/blogSchema");
const mongoose = require('mongoose');
const getSpecificBlog = async (req, res) => {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
}
  try {
    const specificBlog = await Blog.findOne({ _id: req.params.id }).populate(
      "author",
      "name ",
    );
    if (!specificBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(specificBlog);
  } catch (error) {
    return res.status(500).json({
      message: "Error Fetching Blogs",
    });
  }
};

module.exports = getSpecificBlog;
