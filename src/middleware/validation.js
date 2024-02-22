// Importing External Dependencies
const bcrypt = require("bcrypt"); // Import the bcrypt library, which provides cryptographic functions for password hashing. Bcrypt is a password-hashing function designed by Niels Provos and David Mazières, specifically to protect against multi-GPU password cracking attacks.
const validator = require("validator"); // Import the validator library, which provides functions for validating and sanitizing strings. This library is useful for validating user input, such as email addresses, URLs, and other common data types.

// Importing Internal Dependencies
const User = require("../users/model"); // Import the User model from the users module, which defines the structure of user data in the database. This model represents the users table in the database and provides methods for querying this table.

const fetchUser = async (req, res, next) => {
  const oldUsername = req.params.username;
  const user = await User.findOne({ where: { username: oldUsername } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user;
  next();
};

const checkUsernameChanged = (req, res, next) => {
  const { username } = req.body;
  req.usernameChanged = req.user.username !== username;
  next();
};

const validateEmailFormat = (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

const checkEmailChanged = (req, res, next) => {
  const { email } = req.body;
  req.emailChanged = req.user.email !== email;
  next();
};

const checkPasswordChanged = async (req, res, next) => {
  const { password } = req.body;
  req.passwordChanged = false;

  if (password) {
    const isMatch = await bcrypt.compare(password, req.user.password);
    if (!isMatch) {
      req.passwordChanged = true;
    }
  }

  next();
};

module.exports = {
  fetchUser,
  checkUsernameChanged,
  validateEmailFormat,
  checkEmailChanged,
  checkPasswordChanged,
};
