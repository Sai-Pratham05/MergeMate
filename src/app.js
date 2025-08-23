const express = require("express");
const app = express();
const port = 4000;
const User = require("./models/user");
const { ValidationSignUp } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json()); //this is express middleware which parses incoming JSON requests and data is stored inside req.body

app.post("/signup", async (req, res) => {
  //validation of the data
  try {
    ValidationSignUp(req);

    const { firstName, lastName, email, password, gender, skills } = req.body;

    console.log("Processing new user registration");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Registration failed - email already exists");
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    //encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);

    //creating an User's Instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender: gender || "other", // Default gender if not provided
      skills: skills || ["Not specified"], // Default skill if not provided
    });

    await user.save();
    console.log("User registration successful");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).send("ERROR: " + error.message);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Login attempt received");

    // Using case-insensitive search for email
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") },
    });

    if (!user) {
      console.log("Authentication failed - user not found");
      return res.status(404).json({ error: "User not found" });
    }

    // First try direct comparison (for non-hashed passwords in db)
    if (user.password === password) {
      console.log("Authentication successful - direct comparison");

      // Optionally hash the password for future logins
      // user.password = await bcrypt.hash(password, 10);
      // await user.save();

      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }

    // Then try bcrypt comparison (for hashed passwords)
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log("Authentication successful - bcrypt comparison");
        return res.json({
          message: "Login successful",
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      }
    } catch (err) {
      console.log("Authentication error");
    }

    // If we get here, both methods failed
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login: " + error.message });
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const Useremail = req.body.email;
  console.log("User lookup requested");
  try {
    const user = await User.findOne({ email: Useremail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

//get all the data from the database
app.get("/feeds", async (req, res) => {
  try {
    const feeds = await User.find({});
    res.send(feeds);
  } catch (e) {
    res.status(500).send("Failed to retrieve feeds");
  }
});

// Debug route to find a specific user
app.get("/debug/finduser", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send("Email parameter is required");
    }

    console.log("Debug user search initiated");

    // Find all users with emails containing the given string (case insensitive)
    const users = await User.find({
      email: { $regex: email, $options: "i" },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No matching users found",
        allUsers: await User.find({}, "email"), // Return just emails of all users
      });
    }

    res.json({
      message: "Users found",
      count: users.length,
      users: users.map((u) => ({ id: u._id, email: u.email })),
    });
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

//delete the data from id
app.delete("/user", async (req, res) => {
  const UserId = req.body.UserId;
  const user = await User.findByIdAndDelete(UserId);
  console.log("User deletion processed");
  try {
    res.send("deleted successfully");
  } catch (e) {
    res.status(500).send("Failed to delete user");
  }
});

//update the data of the user
app.patch("/user1/:UserId", async (req, res) => {
  const UserId = req.params.UserId;
  const body = req.body;
  try {
    const UPDATION_ALLOWED = ["age", "gender", "photoURL", "skills"];
    const isValidUpdate = Object.keys(body).every((update) =>
      UPDATION_ALLOWED.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send("Invalid update fields");
    }
    const user = await User.findByIdAndUpdate(UserId, body, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (e) {
    res.status(500).send("Failed to update user");
  }
});

//update using email
app.patch("/user1", async (req, res) => {
  try {
    const { email, updates } = req.body;
    if (!email || !updates) {
      return res.status(400).send("Email and updates are required");
    }
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).send("User not found");
    }
    const updatedUser = await User.findByIdAndUpdate(userDoc._id, updates, {
      new: true,
      runValidators: true,
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(500).send("Failed to update user");
    }
    res.send(updatedUser);
  } catch (e) {
    res.status(500).send("Failed to update user");
  }
});

const connectDatabase = require("./config/database");

connectDatabase()
  .then(() => {
    // Start server
    app.listen(port, () => {
      console.log(`Database connected successfully`);
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
