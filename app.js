
const express=require('express')
const app=express();
const cookieParser = require('cookie-parser');
const connectDB=require('./db/conncetDb')
const cors = require("cors")
require('dotenv').config()

connectDB()
//cors
app.use(cors({
  origin: "http://localhost:5173", // or your frontend URL
  credentials: true
}))
// middlewares

app.use(cookieParser());
app.use(express.json())
app.get('/',(req,res)=>{
    res.json({"name":"samir"})
})

//routes
const authenticationMiddlewere=require('./middleware/getme');
// 1.Authentication routes(lofin,signup,Authentication)
const authRoute=require('./routes/authRoute')
app.use('/api/auth',authRoute)
// 2.Blogs routes(lofin,signup,Authentication)
const blogRoute=require('./routes/blogRoute')
app.use('/api/blogs',authenticationMiddlewere,blogRoute)

const PORT=5000;
app.listen(PORT,()=>{
    console.log("Server is listening at port ",PORT);
})