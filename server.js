const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors({
    origin:process.env.DOMEN,
    credentials:true,
}))

app.get("/" ,(req,res) => {
    res.json({text:"Shop Card"})
})

app.listen(3000,() => {
    console.log("Server start work on port http://localhost:3000")
})