// External Dependencies
require("dotenv").config();
const express = require("express");
// const bcrypt = require("bcrypt");

// Internal Dependencies
const UserRouter = require("./users/routes"); // From the users/routes.js file.
const SignupRouter = require("./users/routes"); // From the users/routes.js file.
const LoginRouter = require("./users/routes"); // From the users/routes.js file.
const User = require("./users/model"); // From the users/model.js file.

// Variables
const port = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/users", UserRouter);
app.use("/signup", SignupRouter);
app.use("/login", LoginRouter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Sync Tables
const syncTables = async () => {
  await User.sync();
};

// Server
app.listen(port, () => {
  syncTables();
  console.log(`Server is running on port ${port}`);
});
