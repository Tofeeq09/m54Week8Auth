// External Dependencies
const { Router } = require("express"); // Import the express Router module.

// Internal Dependencies
const {
  signup,
  login,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
} = require("./controllers"); // Import the controller functions from the controllers.js file.
const { hashPassword, comparePassword } = require("../middleware/auth"); // Import the auth middleware functions from middleware/auth.js.

// Variables
const userRouter = Router();
const signupRouter = Router();
const loginRouter = Router();

// Routes
// User Routes
userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUsername);
userRouter.put("/:username", updateUserByUsername);
userRouter.delete("/:username", deleteUserByUsername);
// Sign up Rout
signupRouter.post("/", hashPassword, signup);
// Login Route
loginRouter.post("/", comparePassword, login);

// Export userRouter
module.exports = userRouter;
