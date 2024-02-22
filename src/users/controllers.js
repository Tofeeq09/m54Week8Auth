//  Importing Internal Dependencies
const User = require("./model"); // Import the User model from the model.js file. This model represents the users table in the database and can be used to run queries on this table.
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library, which provides functions for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.

// Route handler / Controller functions
// Create a new user on the POST /api/signup route
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extract the username, email, and password from the request body. These are the user's credentials that they entered in the signup form.
    const user = await User.create({ username, email, password }); // Create a new user in the database using the User model's create method. This method inserts a new row in the users table with the provided username, email, and password. It returns a promise that resolves to the newly created user.

    const userResponse = { id: user.id, username: user.username, email: user.email }; // Create a response object that includes the new user's id, username, and email. This object will be sent back to the client in the response.
    res.status(201).json(userResponse); // Send a 201 Created status code and the userResponse object in the response. The 201 status code indicates that a new resource was successfully created.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
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
// Update a username on the PUT /api/users/:username route
const updateUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract the username from the request parameters. This is the username that the client has included in the URL.
    const [updated] = await User.update(req.body, { where: { username: username } }); // Use the User model's update method to update the user with the specified username in the database. This method returns a promise that resolves to an array. The first element of the array is the number of affected rows.
    if (!updated) {
      res.status(404).json({ message: `User with username ${username} not found` }); // If the number of affected rows is zero (i.e., if the user was not found in the database) then send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
    }

    const updatedUser = await User.findOne({ where: { username: username } }); // If the number of affected rows is not zero (i.e., if the user was successfully updated) then use the User model's findOne method to get the updated user from the database. This method returns a promise that resolves to the updated user.
    res.status(200).json(updatedUser); // Send a 200 OK status code and the updated user in the response. The 200 status code indicates that the request was successful.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request parameters, or a problem with the server itself.
  }
};
// Delete a username on the DELETE /api/users/:username route
const deleteUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract the username from the request parameters. This is the username that the client has included in the URL.
    const deleted = await User.destroy({ where: { username } }); // Use the User model's destroy method to delete the user with the specified username from the database. This method returns a promise that resolves to the number of affected rows.
    if (!deleted) {
      res.status(404).json({ message: `User with username ${username} not found` }); // If the number of affected rows is zero (i.e., if the user was not found in the database) then send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
    }

    res.status(204).json("User deleted"); // If the number of affected rows is not zero (i.e., if the user was successfully deleted) then send a 204 No Content status code and a message in the response. The 204 status code indicates that the request was successful, but there's no representation to return (i.e., the response is empty).
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // Use the User model's destroy method to delete the user with the specified username from the database. This method returns a promise that resolves to the number of affected rows.
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
