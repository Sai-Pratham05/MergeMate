const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saiprathamwork:v7uYxjul2ETi1cUC@mergemate.ykuhsid.mongodb.net/MergeMate"
    );//this is the connection string for MongoDB so this allows us to connect to the database
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDatabase;
