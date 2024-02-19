// External Dependencies
const { Router } = require("express"); // Import the express Router module.

// Internal Dependencies
const {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
} = require("./controllers"); // Import the functions from the controllers.js file.

// Variables
const userRouter = Router();

// Routes
userRouter.post("/signup", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserByUsername);
userRouter.put("/:id", updateUserByUsername);
userRouter.delete("/:id", deleteUserByUsername);

// Export userRouter
module.exports = userRouter;
