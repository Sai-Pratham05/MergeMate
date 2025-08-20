const express = require("express");

const app = express();

app.use("/hello",(req,res)=>{
    res.send("hello my niggesh");
})
app.use("/",(req,res)=>{
    res.send("hello from the root");
})
app.use("/test",(req,res)=>{
    res.send("hello my testi");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});