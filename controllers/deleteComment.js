const commentSchema = require("../models/commentSchema");

const comment_delete = async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required.." });
  }
  try {
    const comment = await commentSchema.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "unauthorized to delete this comment" });
    }

    await commentSchema.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comnent error:", error);
    return res
      .status(500)
      .json({ message: " server error while deleting" });
  }
};

module.exports = comment_delete;
