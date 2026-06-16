const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  }
}, { timestamps: true });


likeSchema.index({ author: 1, blog: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);