// External Dependencies
const bcrypt = require("bcrypt");

// Internal Dependencies
const User = require("../users/model");

// Environment Variables
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// Functions

// Hash the password
// POST /signup
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Replace the plaintext password with the hashed password to be stored in the database
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Compare the password
// POST /login
const comparePassword = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Compare the plaintext password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Password is incorrect" });
      return;
    }
    // Status code 401 is used when a user is not authorized to access a resource.
    // Status code 402 is used when a user needs to authenticate to access a resource.
    // Status code 403 is used when a user is authenticated but not authorized to access a resource.

    // If the passwords match, call next()
    next();
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

// Export the hashPassword middleware function.
module.exports = { hashPassword, comparePassword };
