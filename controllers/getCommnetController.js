const Comment = require('../models/commentSchema');

const getAllcomments = async (req, res) => {

    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 10;
    const skip=(page-1)*limit;
    const blogId=req.params.blogId;
    
    try {
        const total = await Comment.countDocuments({blog:blogId});
        const allComments = await Comment.find({blog:blogId})
             .populate('author', 'name profile')
              .sort({ createdAt: -1 })
             .skip(skip)
             .limit(limit)
               .lean()
             ;
          return res.status(200).json({               
            comments: allComments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalComments:total,
            hasMore:page*limit<total
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error Fetching Comments'
        });
    }
};

module.exports = getAllcomments;