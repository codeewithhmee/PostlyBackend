const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const Like = require('../models/likeSchema');

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Promise.all([
            Blog.findByIdAndDelete(req.params.blogId),
            Comment.deleteMany({ blog: req.params.blogId }), 
            Like.deleteMany({ blog: req.params.blogId })     
        ]);

        return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting blog' });
    }
};

module.exports = deleteBlog;