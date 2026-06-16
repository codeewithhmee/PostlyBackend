const mongoose=require('mongoose');
// console.log(typeof mongoose)//object
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    profile:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjxaG6P_ydF7IcWPNq86sPZxUyuCEDA2U5TQ&s"
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})//it is just a prototype how data will be in data base
// mongoose.model("User",userSchema);//this means in collection users data with schema userSchema will be stored
module.exports=mongoose.model("User",userSchema);