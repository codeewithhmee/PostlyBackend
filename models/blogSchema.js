const mongoose=require('mongoose');
const blogSchema=new mongoose.Schema({
     title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,//it is imported from cloudinary
        
    },
    likes:{
        type:Number,
        default:0
    },
  
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
},{ timestamps: true })
module.exports=mongoose.model("Blog",blogSchema);
