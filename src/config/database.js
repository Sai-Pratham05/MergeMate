require("dotenv").config();
const mongoose = require("mongoose");

// code to connect to mongoDB atlas
const connectDB = async () => {
  try{
  await mongoose.connect(
    `mongodb+srv://${process.env.name}:${process.env.password}@mergemate.ykuhsid.mongodb.net/MergeMate`
  );
   console.log(
      `Database connected : ${mongoose.connection.host}, ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
      process.exit(1);
  }
};

module.exports = { connectDB };