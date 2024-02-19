// Internal Dependencies
const User = require("./model"); // Import the Book model from the model.js file.

// Functions

// Create a new user
// POST /users
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const userResponse = { id: user.id, username: user.username, email: user.email };
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by username
// GET /users/:username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with username ${username} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  res.status(200).json({ message: "Login successful", username: req.body.username });
};

// Update a username
// PUT /users/:username
const updateUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const [updated] = await User.update(req.body, {
      where: { username: username },
    });
    if (updated) {
      const updatedUser = await User.findOne({ where: { username: username } });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: `User with username ${username} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a username
// DELETE /users/:username
const deleteUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const deleted = await User.destroy({ where: { username } });
    if (deleted) {
      res.status(204).send("User deleted");
    } else {
      res.status(404).json({ message: `User with username ${username} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the functions
module.exports = {
  signup,
  login,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
};
