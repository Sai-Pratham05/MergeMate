const mongoose = require("mongoose");
const validator = require("validator"); //this is used to throw the validation check installed from npm

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("weak password");
        }
      },
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
    photoURL: {
      type: String,
      required: true,
      default:
        "https://www.pikpng.com/pngl/b/417-4172348_testimonial-user-icon-color-clipart.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL format");
        }
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    skills: {
      type: [String],
      required: [true, "Skills are required"],
      validate: {
        validator: function (arr) {
          return (
            Array.isArray(arr) &&
            arr.length >= 1 &&
            arr.length < 5 &&
            arr.every(
              (skill) => typeof skill === "string" && skill.trim().length > 0
            )
          );
        },
        message:
          "User must have at least 1 non-empty skill and less than 5 skills.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema); //model accepts a name and schema and here User is the name of the model and it can be used to create and manage user documents in the database

module.exports = User;
