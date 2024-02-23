//  Importing Internal Dependencies
const User = require("./model"); // Import the User model from the model.js file. This model represents the users table in the database and can be used to run queries on this table.
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library, which provides functions for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.
const { UniqueConstraintError } = require("sequelize");

// Route handler / Controller functions
// Create a new user on the POST /api/signup route
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extract the username, email, and password from the request body. These are the user's credentials that they entered in the signup form.
    const user = await User.create({ username, email, password }); // Create a new user in the database using the User model's create method. This method inserts a new row in the users table with the provided username, email, and password. It returns a promise that resolves to the newly created user.

    const userResponse = { id: user.id, username: user.username, email: user.email }; // Create a response object that includes the new user's id, username, and email. This object will be sent back to the client in the response.
    res.status(201).json(userResponse); // Send a 201 Created status code and the userResponse object in the response. The 201 status code indicates that a new resource was successfully created.
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      // If the error is an instance of UniqueConstraintError, it means that the username or email already exists in the database. This is a constraint violation, and it occurs when trying to insert or update a row with a value that already exists in the database. In this case, we want to send a more specific error message to the client.

      const field = error.errors[0].path; // Get the field (i.e., the column name) that caused the constraint violation. This will be either "username" or "email".
      if (field === "username") {
        res.status(400).json({ message: "The username you entered is already taken" }); // If the field is "username", send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
        return; // End the function execution here. The following code will not be executed.
      }
      if (field === "email") {
        res.status(400).json({ message: "The email you entered is already associated with another account" }); // If the field is "email", send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
        return; // End the function execution here. The following code will not be executed.
      }
    }

    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
  }
};
// Log in a user on the POST /api/login route. This route handles both manual login and persistent login.
const login = async (req, res) => {
  try {
    // https://www.npmjs.com/package/jsonwebtoken

    if (req.authCheck) {
      const user = { id: req.authCheck.id, username: req.authCheck.username }; // Create a response object that includes the user's id and username, token is not needed as the client already has it. This object will be sent back to the client in the response.

      res.status(201).json({ message: "persistent login successful", user: user }); // Send a 201 Created status code and the user object in the response. The 201 status code indicates that a new resource was successfully created.
      return; // End the function execution here. The following code will not be executed.
    }

    const token = jwt.sign({ id: req.user.id }, process.env.SECRET); // Create a new JWT using the jsonwebtoken library. The jwt.sign() method takes a payload (in this case, the user's id) and a secret key as arguments, and returns a new JWT. The secret key should be stored in an environment variable for security. The JWT is a string that contains the payload and a signature, and it can be used to authenticate the user in future requests.

    const user = { id: req.user.id, username: req.user.username, token: token }; // Create a response object that includes the user's id, username, and token. This object will be sent back to the client in the response.

    res.status(201).json({ message: "login success", user: user }); // Send a 201 Created status code and the user object in the response. The 201 status code indicates that a new resource was successfully created.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the jsonwebtoken library, a problem with the User model, a problem with the request body, or a problem with the server itself.
  }
};
// Get all users on the GET /api/users route
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Use the User model's findAll method to get all users from the database. This method returns a promise that resolves to an array of all users.
    if (!users.length) {
      res.status(404).json({ message: "No users found" }); // If the array of users is empty (i.e., if there are no users in the database) then send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
      return; // End the function execution here. The following code will not be executed.
    }

    const usersResponse = users.map((user) => ({ id: user.id, username: user.username, email: user.email })); // Create a response array that includes the id, username, and email of each user. This array will be sent back to the client in the response.

    res.status(200).json(usersResponse); // Send a 200 OK status code and the array of users in the response. The 200 status code indicates that the request was successful.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
  }
};
// Get a user by username on the GET /api/users/:username route
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract the username from the request parameters. This is the username that the client has included in the URL.
    const user = await User.findOne({ where: { username } }); // Use the User model's findOne method to get the user with the specified username from the database. This method returns a promise that resolves to the user if found, or null if not found.
    if (!user) {
      res.status(404).json({ message: `User with username ${username} not found` }); // If the user is not found (i.e., if user is null), send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
      return; // End the function execution here. The following code will not be executed.
    }

    const userResponse = { id: user.id, username: user.username, email: user.email }; // Create a response object that includes the user's id, username, and email. This object will be sent back to the client in the response.

    res.status(200).json(userResponse); // Send a 200 OK status code and the userResponse object in the response. The 200 status code indicates that the request was successful.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request parameters, or a problem with the server itself.
  }
};
// Update a username on the PUT /api/users/:username route
const updateUserByUsername = async (req, res) => {
  try {
    const oldUsername = req.params.username; // Extract the old username from the request parameters. This is the username that the client has included in the URL.
    let { username, email, password } = req.body; // Extract the new username, email, and password from the request body. These are the updated user credentials that the client has sent in the request.
    let updateMessage = []; // Create an empty array to store messages about the updates made to the user's data.

    if (!req.usernameChanged && !req.emailChanged && !req.passwordChanged) {
      res.status(400).json({ message: "No changes detected" }); // If none of the user's data has been changed, send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
      return; // End the function execution here. The following code will not be executed.
    }

    await User.update({ username, email, password }, { where: { username: oldUsername } }); // Only if the user's data has been changed, use the User model's update method to update the user's data in the database. This method takes two arguments: an object containing the new username, email, and password, and an object containing the where clause to specify which user to update. It returns a promise that resolves to the number of affected rows.

    if (req.usernameChanged) {
      username = req.body.username; // If the username has been changed, update the username variable with the new username from the request body.
      updateMessage.push(`username updated from ${oldUsername} to ${username}`); // Add a message to the updateMessage array indicating that the username has been updated.
    }
    if (req.emailChanged) {
      email = req.body.email; // If the email has been changed, update the email variable with the new email from the request body.
      updateMessage.push(`email updated from ${req.user.email} to ${email}`); // Add a message to the updateMessage array indicating that the email has been updated.
    }
    if (req.passwordChanged) {
      updateMessage.push(`password updated`); // If the password has been changed, add a message to the updateMessage array indicating that the password has been updated.
    }

    const userResponse = {
      id: req.user.id,
      username: username,
      email: email,
      updateMessage: updateMessage,
    }; // Create a response object that includes the user's id, updated username, updated email, and updateMessage. This object will be sent back to the client in the response.

    res.status(200).json(userResponse); // Send a 200 OK status code and the userResponse object in the response. The 200 status code indicates that the request was successful.
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      // If the error is an instance of UniqueConstraintError, it means that the username or email already exists in the database. This is a constraint violation, and it occurs when trying to insert or update a row with a value that already exists in the database. In this case, we want to send a more specific error message to the client.

      const field = error.errors[0].path; // Get the field (i.e., the column name) that caused the constraint violation. This will be either "username" or "email".
      if (field === "username") {
        res.status(400).json({ message: "The username you entered is already taken" }); // If the field is "username", send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
        return; // End the function execution here. The following code will not be executed.
      }
      if (field === "email") {
        res.status(400).json({ message: "The email you entered is already associated with another account" }); // If the field is "email", send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
        return; // End the function execution here. The following code will not be executed.
      }
    }

    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};
// Delete a username on the DELETE /api/users/:username route
const deleteUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract the username from the request parameters. This is the username that the client has included in the URL.

    const user = await User.findOne({ where: { username } }); // Use the User model's findOne method to get the user with the specified username from the database. This method returns a promise that resolves to the user if found, or null if not found.
    if (!user) {
      res.status(404).json({ message: `User with username ${username} not found` }); // If the user is not found (i.e., if user is null), send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
      return; // End the function execution here. The following code will not be executed.
    }

    if (!req.passwordChanged) {
      res.status(400).json({ message: "Invalid credentials" }); // If the user's credentials are not valid, send a 400 Bad Request status code and a message in the response. The 400 status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
      return; // End the function execution here. The following code will not be executed.
    }

    await User.destroy({ where: { username } }); // Use the User model's destroy method to delete the user with the specified username from the database. This method returns a promise that resolves to the number of affected rows.

    res.status(200).json({ message: `User with username ${username} deleted` }); // Send a 200 OK status code and a message in the response. The 200 status code indicates that the request was successful.
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error details in the response.
    return; // End the function execution here. The following code will not be executed.
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
}; // Export the controller functions for use in other files. These functions handle the logic for the different routes. Each function corresponds to a specific route and HTTP method, and contains the logic to handle requests to that route.
