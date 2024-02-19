const { Router } = require("express");

const userRouter = Router();

const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("./controllers");

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
