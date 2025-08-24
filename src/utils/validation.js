const validator = require("validator");
const jwt = require("jsonwebtoken")
require("dotenv").config();


const validateSignUpData = (res) => {
  const { firstName, lastName, email, password } = res.body;

  if (!firstName) {
    throw new Error("Enter a firstName");
  } else if (firstName.length > 30 || firstName.length < 3) {
    throw new Error("Username must be 3-30 characters");
  } else if (!firstName) {
    throw new Error("Enter a name");
  } else if (firstName.length > 25 || firstName.length < 3) {
    throw new Error("First name must be 3-25 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};
const validateLoginData = (res) => {
  const { firstName, email, password } = res.body;

  if (!firstName) {
    if (!email) {
      throw new Error("Enter a UserId");
    }
  } else if (firstName && !email) {
    if (firstName.length > 30 || firstName < 3) {
      throw new Error("firstName must be 3-30 characters");
    }
  } else if (!firstName && email) {
    if (!validator.isEmail(email)) {
      throw new Error("Enter a valid email");
    }
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const isTokenValid = async (token)=>{
  const decodedMessage = jwt.verify(token,process.env.secretJWT)
  return decodedMessage;
}

module.exports = { validateSignUpData, validateLoginData, isTokenValid };