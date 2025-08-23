const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saiprathamwork:v7uYxjul2ETi1cUC@mergemate.ykuhsid.mongodb.net/MergeMate"
    );
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDatabase;
