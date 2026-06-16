const express = require("express");
const router = express.Router();
//controllers
const blog_post=require('../controllers/postblogController')
const getAllBlogs=require('../controllers/getAllBlogsController')
const getSpecificBlog=require('../controllers/getSpecificBlog')
const deleteBlog=require('../controllers/deleteBlogController')
const updateBlog=require('../controllers/updateBlogController');
const myBlogs=require('../controllers/getMyBlogs')
const comment=require('../controllers/commentController')
const getAllComments=require('../controllers/getCommnetController')
const deleteComment=require('../controllers/deleteComment')
const postLike=require('../controllers/postLikeController')
const getSpeficUserBlogs=require('../controllers/getSpecificPersonBlog');
const getSearchedBlog=require('../controllers/getSearchedBlog')
const getSearchedUser=require('../controllers/getSearchedUsersController')
const updateUser=require('../controllers/updateProfile');
//middlewate
const upload = require('../middleware/upload');
//routes
router.post('/blog',upload.single('image'),blog_post)
router.get('/blog',getAllBlogs)
router.get('/blog/:id',getSpecificBlog)
router.delete('/blog/:blogId', deleteBlog)
router.patch('/update-blog/:blogId',upload.single('image'),updateBlog)
router.get('/my-blogs',myBlogs)
router.post('/comment',comment);
router.get('/:blogId/comments',getAllComments)
router.delete('/comment', deleteComment)
router.post('/like',postLike)
router.get('/get_specific/:userid',getSpeficUserBlogs)
router.get('/searched_blog',getSearchedBlog);
router.get('/search_user',getSearchedUser);
router.put('/update_user',upload.single('image'),updateUser);






module.exports=router;