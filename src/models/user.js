const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);//model accepts a name and schema and here User is the name of the model and it can be used to create and manage user documents in the database

module.exports = User;
