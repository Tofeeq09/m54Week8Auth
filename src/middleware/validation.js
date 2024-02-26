// Importing External Dependencies
const bcrypt = require("bcrypt"); // Import the bcrypt library, which provides cryptographic functions for password hashing. Bcrypt is a password-hashing function designed by Niels Provos and David Mazières, specifically to protect against multi-GPU password cracking attacks.
const validator = require("validator"); // Import the validator library, which provides functions for validating and sanitizing strings. This library is useful for validating user input, such as email addresses, URLs, and other common data types.

// Validation Middleware Functions

const validateUsername = (req, res, next) => {
  const { username } = req.body; // Retrieve the username from the request body. This is the username that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the username is sent as part of the request body, such as { username: "newUsername" }.

  if (!username || username.length < 3 || username.length > 20) {
    res.status(400).json({ message: "Username must be between 3 and 20 characters" }); // If the username is not provided or it is less than 3 characters or more than 20 characters, respond with a status code of 400 and a JSON object containing an error message. The status() method sets the HTTP status for the response, and the json() method sends a JSON response.
    return; // Return early to exit the middleware function. This prevents the next() function from being called, which would pass control to the next middleware or route handler.
  }

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

// PUT /api/users/:username route
const checkUsernameChanged = (req, res, next) => {
  const { username } = req.body; // Retrieve the new username from the request body. This is the username that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the username is sent as part of the request body, such as { username: "newUsername" }.
  req.usernameChanged = username !== undefined && req.user.username !== username; // Check if the username has been changed. If the new username is different from the old username, set the usernameChanged property on the request object to true. Otherwise, set it to false. This property is used to track whether the username has been changed in the request.

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

// POST /api/signup route
// POST /api/login route
// PUT /api/users/:username route
const validateEmail = (req, res, next) => {
  const { email } = req.body; // Retrieve the email from the request body. This is the email that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the email is sent as part of the request body, such as { email: "

  if (email && !validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email format" }); // If the email is provided and it is not a valid email format, respond with a status code of 400 and a JSON object containing an error message. The status() method sets the HTTP status for the response, and the json() method sends a JSON response.
    return; // Return early to exit the middleware function. This prevents the next() function from being called, which would pass control to the next middleware or route handler.
  }

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

// POST /api/signup route
const checkEmailChanged = (req, res, next) => {
  const { email } = req.body; // Retrieve the new email from the request body. This is the email that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the email is sent as part of the request body, such as { email: "
  req.emailChanged = email !== undefined && req.user.email !== email; // Check if the email has been changed. If the new email is different from the old email, set the emailChanged property on the request object to true. Otherwise, set it to false. This property is used to track whether the email has been changed in the request.

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

// This function could be used in your signup and update password routes
const validatePassword = (req, res, next) => {
  const { password } = req.body; // Retrieve the password from the request body. This is the password that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the password is sent as part of the request body, such as { password: "newPassword" }.

  if (password && password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters" }); // If the password is provided and it is less than 8 characters, respond with a status code of 400 and a JSON object containing an error message. The status() method sets the HTTP status for the response, and the json() method sends a JSON response.
    return; // Return early to exit the middleware function. This prevents the next() function from being called, which would pass control to the next middleware or route handler.
  }

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

// PUT /api/users/:username route
const checkPasswordChanged = async (req, res, next) => {
  const { password } = req.body; // Retrieve the new password from the request body. This is the password that the client wants to update. The request body is part of the HTTP request and contains data sent by the client, typically in a POST or PUT request. In this case, the password is sent as part of the request body, such as { password: "newPassword" }.
  req.passwordChanged = false; // Initialize the passwordChanged property on the request object to false. This property is used to track whether the password has been changed in the request.

  if (password) {
    const match = await bcrypt.compare(password, req.user.password); // Use the compare method of the bcrypt library to compare the new password with the hashed password stored in the database. The compare method returns a Promise, so we use the await keyword to wait for the result.
    if (!match) {
      req.passwordChanged = true; // If the new password does not match the hashed password in the database, set the passwordChanged property on the request object to true. This indicates that the password has been changed in the request.
    }
  }

  next(); // Call the next() function to pass control to the next middleware or route handler. This is necessary to continue processing the request and ensure that the response is sent back to the client.
};

module.exports = {
  validateUsername,
  checkUsernameChanged,
  validateEmail,
  checkEmailChanged,
  validatePassword,
  checkPasswordChanged,
}; // Export the validation middleware functions for use in other files. These functions perform checks and validations on user input, and are used to ensure that the data provided by the client is valid and safe to use in the application. This helps to prevent security vulnerabilities and data corruption.
