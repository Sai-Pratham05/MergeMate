const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      },
    },
    age: {
      type: Number,
      min: [13, "User must be at least 13 years old"],
      max: [120, "Invalid age"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
    },
    photoURL: {
      type: String,
      default:
        "https://www.pikpng.com/pngl/b/417-4172348_testimonial-user-icon-color-clipart.png",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid URL format",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (!arr) return true; // Skip validation if not provided
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
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // This replaces the manual createdAt and updatedAt fields
  }
);

// Create a compound index for improved query performance
userSchema.index({ email: 1 });

// Instance method to hide sensitive information when sending user data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Don't send password
  return user;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  // Note: You'll need to use bcrypt.compare in your route handler
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
