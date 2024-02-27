const { Router } = require("express");

const { getAllBooks, addBooks, addBookToUserLibrary, removeBookFromUserLibrary } = require("./controllers");
const { verifyToken } = require("../middleware/verifyToken");

const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.post("/", addBooks);
bookRouter.post("/add", verifyToken, addBookToUserLibrary);
bookRouter.delete("/remove", verifyToken, removeBookFromUserLibrary);

module.exports = {
  bookRouter,
};
