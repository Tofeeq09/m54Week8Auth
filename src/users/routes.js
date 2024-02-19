// External Dependencies
const { Router } = require("express"); // Import the express Router module.

// Internal Dependencies
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("./controllers"); // Import the functions from the controllers.js file.

// Variables
const userRouter = Router();

// Routes
userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

// Export userRouter
module.exports = userRouter;
