const Blog = require('../models/blogSchema');
const Like = require('../models/likeSchema');

const getAllBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const blog_name = req.query.blogName;
    let category = req.query.category;
    try {
        const filter = {};
        if (blog_name) filter.title = { $regex: blog_name, $options: "i" };
        if (category) filter.category = category;
        const total = await Blog.countDocuments(filter);
        const allBlogs = await Blog.find(filter)
            .select('title category image author createdAt likes')
            .populate('author', 'name profile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const blog_ids = allBlogs.map((blog) => blog._id);

        const userLikes = await Like.find({
            author: req.user.id,
            blog: { $in: blog_ids }
        }).select('blog');

        const likedSet = new Set(userLikes.map(l => l.blog.toString()));

        const blogs = allBlogs.map(blog => ({
            ...blog,
            isLiked: likedSet.has(blog._id.toString())
        }));

        return res.status(200).json({
            blogs: blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error Fetching Blogs'
        });
    }
};

module.exports = getAllBlogs;