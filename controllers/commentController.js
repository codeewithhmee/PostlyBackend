const commentSchema=require('../models/commentSchema');
const comment_post = async (req, res) => {
 console.log(req.user);
 console.log(req.body)
 const commenter_id=req.user.id;
 const blog_id=req.body.blogId;
 if (!blog_id) {
    return res.status(400).json({ message: "Blog ID is required" });
}
 const comment=req.body.comment;
if (!comment || !comment.trim()) {
    return res.status(400).json({ success: false, message: "Comment content cannot be empty" });
  }
 try {
   const new_comment=new commentSchema({text:comment,author:commenter_id,blog:blog_id});
   await new_comment.save();
   console.log(new_comment)
   await new_comment.populate("author", "name profile");
   return res.status(201).json({success:true,message:"Successfully Commented!!",new_comment:new_comment});

 } catch (error) {
   return res.status(500).json({success:false,message:"Error on posting..."});
    
 }
};
module.exports=comment_post;
