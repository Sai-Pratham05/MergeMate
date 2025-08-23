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
