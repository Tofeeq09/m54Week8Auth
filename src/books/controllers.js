const { Book } = require("./model");
const User = require("../users/model");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(`Error fetching books: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

const addBooks = async (req, res) => {
  try {
    const books = [
      { title: "1", author: "1", genre: "1" },
      { title: "2", author: "2", genre: "2" },
      { title: "3", author: "3", genre: "3" },
      { title: "4", author: "4", genre: "4" },
      { title: "5", author: "5", genre: "5" },
      { title: "6", author: "6", genre: "6" },
      { title: "7", author: "7", genre: "7" },
      { title: "8", author: "8", genre: "8" },
      { title: "9", author: "9", genre: "9" },
      { title: "10", author: "10", genre: "10" },
      { title: "11", author: "11", genre: "11" },
      { title: "12", author: "12", genre: "12" },
      { title: "13", author: "13", genre: "13" },
      { title: "14", author: "14", genre: "14" },
      { title: "15", author: "15", genre: "15" },
      { title: "16", author: "16", genre: "16" },
      { title: "17", author: "17", genre: "17" },
      { title: "18", author: "18", genre: "18" },
      { title: "19", author: "19", genre: "19" },
      { title: "20", author: "20", genre: "20" },
    ];

    await Book.bulkCreate(books);
    res.json(`Books added successfully.`);
  } catch (error) {
    console.error(`Error adding books: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

const addBookToUserLibrary = async (req, res) => {
  const username = req.body.username;
  const bookTitle = req.body.bookTitle;

  try {
    // Find the user
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: `User with username ${username} not found.` });
    }

    // Find the book
    const book = await Book.findOne({
      where: {
        title: bookTitle,
      },
    });

    if (!book) {
      return res.status(404).json({ error: `Book with title ${bookTitle} not found.` });
    }

    // Add the book to the user's library
    await user.addBook(book);

    res.json({ message: `Book added to user's library successfully.` });
  } catch (error) {
    console.error(`Error adding book to user's library: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

const getUserBooks = async (req, res) => {
  const username = req.params.username;

  try {
    // Find the user
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: `User with username ${username} not found.` });
    }

    // Get the user's books
    let books = await user.getBooks();

    // Simplify the books array
    books = books.map((book) => ({
      title: book.title,
      author: book.author,
      genre: book.genre,
    }));

    res.status(200).json(books);
  } catch (error) {
    console.error(`Error fetching user's books: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllBooks, addBooks, addBookToUserLibrary, getUserBooks };
