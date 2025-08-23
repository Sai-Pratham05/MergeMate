const express = require("express");
const app = express();
const port = 3000;
const User = require("./models/user");

app.use(express.json()); //this is express middleware which parses incoming JSON requests and data is stored inside req.body

app.post("/signup", async (req, res) => {
  //creating an User's Instance
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create user" });
    });
});

//get user by email

app.get("/user", async (req, res) => {
  // console.log(req.body);
  const Useremail = req.body.email;
  console.log(Useremail);
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

//delete the data from id

app.delete("/user", async (req, res) => {
  const UserId = req.body.UserId;
  const user = await User.findByIdAndDelete(UserId);
  console.log(user);
  try {
    res.send("deleted succesfully");
  } catch (e) {
    res.status(500).send("Failed to delete user");
  }
});
//update the data of the user

app.patch("/user", async (req, res) => {
  const UserId = req.body.UserId;
  const updates = req.body.updates;
  const user = await User.findByIdAndUpdate(UserId, updates, { new: true });
  console.log(user);
  try {
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
    },{runValidators: true},{ReturnDocument: "after"});
    if (!updatedUser) {
      return res.status(500).send("Failed to update user");
    }
    res.send(updatedUser);
  } catch (e) {
    res.status(500).send("Failed to update user");
  }
});

const connectDatabase = require("./config/database");
const { ReturnDocument } = require("mongodb");

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
