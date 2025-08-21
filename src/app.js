const express = require("express");
const app = express();
const port = 3000;



const AdminInfo = (req,res,next) => {
  if(req.query.user === "sai") {
    req.user = { name: "Sai", role: "admin" };
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

// Advanced middleware: authentication simulation
const authenticate = (req, res, next) => {
  if (req.headers["x-auth-token"] === "valid-token") {
    req.user = { name: "Sai", role: "admin" };
    next();
  } else {
    res.status(401).send("Authentication failed");
  }
};

// Advanced middleware: request timing
const requestTimer = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// Advanced middleware: input validation
const validateId = (req, res, next) => {
  if (!/^[0-9]+$/.test(req.params.id)) {
    return res.status(400).send("Invalid ID format");
  }
  next();
};

// Chained middlewares for a protected admin route
app.get("/admin/:id", authenticate, requestTimer, validateId, (req, res) => {
  res.send(
    `Hello ${req.user.name}, you accessed admin ID ${req.params.id} at ${new Date(
      req.requestTime
    ).toLocaleTimeString()}`
  );
});

// Middleware chaining for logging and custom logic
const logRoute = (req, res, next) => {
  console.log(`Route accessed: ${req.originalUrl}`);
  next();
};

const customLogic = (req, res, next) => {
  req.custom = "Custom logic applied!";
  next();
};

app.get("/complex/:data", logRoute, customLogic, (req, res) => {
  res.send(`Data: ${req.params.data}, Message: ${req.custom}`);
});

// POST route with middleware for JSON body parsing and validation
app.use(express.json());
const validateBody = (req, res, next) => {
  if (!req.body || !req.body.name) {
    return res.status(400).send("Missing 'name' in request body");
  }
  next();
};

app.post("/submit", validateBody, (req, res) => {
  res.send(`Received name: ${req.body.name}`);
});

app.use((req, res, next) => {
  console.log("Logging request...");
  next();
});
// Route-level middleware
const checkUser = (req, res, next) => {
  if (req.query.user === "sai") {
    next(); // let him in
  } else {
    res.status(403).send("Access denied");
  }
};

// Route using middleware
app.get("/secret", AdminInfo, (req, res) => {
  const { user } = req;
  console.log(user);
  res.send(`Welcome ${user.name}, this is the secret route!`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send("Server error");
});


















// ✅ Basic GET route
app.get("/", (req, res) => {
  res.send("Welcome to Regex + Dynamic Routes Playground!");
});

// ✅ Dynamic route with parameter
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  res.send(`User ID is: ${id}`);
});

// ✅ Multiple params
app.get("/product/:category/:id", (req, res) => {
  const { category, id } = req.params;
  res.send(`Category: ${category}, Product ID: ${id}`);
});

// ✅ Regex route: match only numbers
app.get("/number/:num([0-9]+)", (req, res) => {
  const { num } = req.params;
  res.send(`You entered a number: ${num}`);
});

// ✅ Regex route: match only alphabets
app.get("/alpha/:word([a-zA-Z]+)", (req, res) => {
  const { word } = req.params;
  res.send(`You entered a word: ${word}`);
});

// ✅ Regex with query params
// Example: /search?term=node&limit=10
app.get("/search", (req, res) => {
  const { term, limit } = req.query;
  res.send(`Search term: ${term}, Limit: ${limit}`);
});

// ✅ Regex: match emails (simple pattern)
app.get(
  "/email/:mail([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,})",
  (req, res) => {
    res.send(`Valid email: ${req.params.mail}`);
  }
);

// ✅ Regex: match date format YYYY-MM-DD
app.get("/date/:date(\\d{4}-\\d{2}-\\d{2})", (req, res) => {
  res.send(`Valid date: ${req.params.date}`);
});

app.use("/niggu", [
  (req, res, next) => {
    res.send("User route accessed");
    // Do not call next() after sending a response
  },
  (req, res) => {
    // This middleware will not be reached unless next() is called above
    res.send("Next middleware reached");
  },
]);

// ✅ Wildcard route (catch all others)
app.get("*", (req, res) => {
  res.send("This route catches everything else 🚀");
}); //this means any route not defined above will be caught here

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
