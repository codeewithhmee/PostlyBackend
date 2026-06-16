const express = require('express')
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./db/conncetDb')
const cors = require("cors")
const fs = require("fs");

require('dotenv').config()

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

connectDB()

app.use(cors({
  origin: ["http://localhost:5173","https://postly-frontend-vud5.vercel.app"],
  credentials: true
}))

//middleware
app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ "name": "samir" })
})

//routes
const authenticationMiddlewere = require('./middleware/getme');

//auth route
const authRoute = require('./routes/authRoute')
app.use('/api/auth', authRoute)

//blogs orute
const blogRoute = require('./routes/blogRoute')
app.use('/api/blogs', authenticationMiddlewere, blogRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is listening at port ", PORT);
})