const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const app = express();

app.use(cors({
    origin:process.env.DOMEN,
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());

try{
    mongoose.connect(process.env.MONGO)
    console.log("Connected MongoDB...")
}catch{
    console.log("ERROR WITH CONNECT...")
    process.exit(1);
}

const userSchema = mongoose.Schema({
    name:String,
})

const User = mongoose.model("User",userSchema);

app.get("/" ,Auth,(req,res) => {
    res.json({text:"Shop Card"})
})

app.post('/api/post',async (req,res) => {
    const {name} = req.body;
    const user = new User({name:name});
    await user.save();

    const token = jwt.sign({name:name},process.env.SECRET,{expiresIn:"1d"});
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    });

    console.log("Saved");
    res.json({text:"Created..."})
})

async function Auth(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({status:false});
    }
    try{
        const decoded = jwt.verify(token , process.env.SECRET)
        req.user = decoded;
        next()
    }catch(err){
        console.log(err);
        console.log("JWT ERROR")
        return res.status(401).json({status:false})
    }
}

app.listen(3000,() => {
    console.log("Server start work on port http://localhost:3000")
})