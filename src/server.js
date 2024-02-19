// External Dependencies
require("dotenv").config();
const express = require("express");

// Internal Dependencies
const UserRouter = require("./users/routes"); // From the books/routes.js file.
const User = require("./users/model"); // From the books/model.js file.
const sequelize = require("./db/connection"); // From the db/connection.js file.

// Variables
const port = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/books", UserRouter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const syncTables = async () => {
  await sequelize.sync(); // sequelize.sync() - is equivalent to Book.sync() and Author.sync() and Genre.sync() but it syncs all the tables at once.
};

// Server
app.listen(process.env.PORT, () => {
  syncTables();
  console.log(`Server is running on port ${port}`);
});
