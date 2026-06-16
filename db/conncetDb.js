const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Databse Sucessfully Connected....");
  } catch (err) {
    console.log("Error while connecting....");
  }
}
module.exports = connect;
