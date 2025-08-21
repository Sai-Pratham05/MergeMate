const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://saipratham007:AJH8ncfNyPt4Veyc@mergemate.g7vk2b0.mongodb.net/MergeMate"
  );
}; //this returns a promise

module.exports = connectDatabase;

