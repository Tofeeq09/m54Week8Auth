// External Dependencies
require("dotenv").config();
const express = require("express");
// const bcrypt = require("bcrypt");

// Internal Dependencies
const UserRouter = require("./users/routes"); // From the users/routes.js file.
const User = require("./users/model"); // From the users/model.js file.

// Variables
const port = process.env.PORT || 5001;
const app = express();

// const saltRounds = 10;
// const plainTextPassword = "password";
// const hashPassword = async () => {
//   let hash = await bcrypt.hash(plainTextPassword, saltRounds);
//   console.log(hash);
// };
// hashPassword();

// Middlewares
app.use(express.json());

// Routes
app.use("/users", UserRouter);

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
