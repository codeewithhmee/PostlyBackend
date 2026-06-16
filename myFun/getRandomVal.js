const generateOtp= ()=>{
const allChar="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let otp="";
for(let i=0;i<5;i++){
    const index=Math.floor(Math.random()*allChar.length)
    otp+=allChar[index];
}
return otp;
}
module.exports=generateOtp;