const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
      validate(value) {
        if (value !== "male" && value !== "female" && value !== "other") {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      required: true,
      default:
        "https://www.pikpng.com/pngl/b/417-4172348_testimonial-user-icon-color-clipart.png",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema); //model accepts a name and schema and here User is the name of the model and it can be used to create and manage user documents in the database

module.exports = User;
