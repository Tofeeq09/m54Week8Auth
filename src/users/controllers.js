// Importing External Dependencies
const { Op } = require("sequelize"); // Import the Op object from the sequelize module. This object provides operators that can be used to perform operations in Sequelize queries. Operators include $eq, $ne, $gt, $gte, $lt, $lte, $in, $notIn, $like, $notLike, $iLike, $notILike, $regexp, $notRegexp, $iRegexp, $notIRegexp, $between, $notBetween, $overlap, $contains, $contained, $adjacent, $strictLeft, $strictRight, $noExtendRight, $noExtendLeft, $and, $or, $any, $all, $values, $col, $raw, $json, $jsonb, $cast, $literal, etc.

//  Importing Internal Dependencies
const User = require("./model"); // Import the User model from the model.js file. This model represents the users table in the database and can be used to run queries on this table.
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library, which provides functions for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.
const { UniqueConstraintError } = require("sequelize");

// Route handler / Controller functions

// POST /api/signup route - This route handles user signup.
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extract the username, email, and password from the request body. These are the user's credentials that they entered in the signup form.
    const user = await User.create({ username, email, password }); // Create a new user in the database using the User model's create method. This method inserts a new row in the users table with the provided username, email, and password. It returns a promise that resolves to the newly created user.

    const token = jwt.sign({ id: user.id }, process.env.SECRET); // Create a new JWT using the jsonwebtoken library. The jwt.sign() method takes a payload (in this case, the user's id) and a secret key as arguments, and returns a new JWT. The secret key should be stored in an environment variable for security. The JWT is a string that contains the payload and a signature, and it can be used to authenticate the user in future requests.
    const serverResponse = { id: user.id, username: user.username, token: token }; // Create a response object that includes the user's id, username, email, and token. This object will be sent back to the client in the response.

    res.status(201).json({ message: "Sign up success", user: serverResponse }); // Send a 201 Created status code and the userResponse object in the response. The 201 status code indicates that a new resource was successfully created.
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

    res.status(500).json({ error: { name: error.name, message: error.message } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};

// POST /api/login route - This route handles both manual login and persistent login.
const login = async (req, res) => {
  try {
    // https://www.npmjs.com/package/jsonwebtoken

    if (req.verify) {
      const user = { id: req.verify.id, username: req.verify.username }; // Create a response object that includes the user's id and username, token is not needed as the client already has it. This object will be sent back to the client in the response.

      res.status(201).json({ message: "Session restored successfully", user: user }); // Send a 201 Created status code and the user object in the response. The 201 status code indicates that a new resource was successfully created.
      return; // End the function execution here. The following code will not be executed.
    }

    const token = jwt.sign({ id: req.user.id }, process.env.SECRET); // Create a new JWT using the jsonwebtoken library. The jwt.sign() method takes a payload (in this case, the user's id) and a secret key as arguments, and returns a new JWT. The secret key should be stored in an environment variable for security. The JWT is a string that contains the payload and a signature, and it can be used to authenticate the user in future requests.
    const user = { id: req.user.id, username: req.user.username, token: token }; // Create a response object that includes the user's id, username, and token. This object will be sent back to the client in the response.

    res.status(201).json({ message: "Login success", user: user }); // Send a 201 Created status code and the user object in the response. The 201 status code indicates that a new resource was successfully created.
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the jsonwebtoken library, a problem with the User model, a problem with the request body, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};

// GET /api/users route - This route retrieves all users from the database.
const getAllUsers = async (req, res) => {
  try {
    let whereClause = {}; // Create an empty object to store the where clause for the query. This object will be used to filter the users based on the query parameters in the request.

    if (req.query.username && req.query.username.trim() !== "") {
      // Check if the username query parameter is present and not empty. If it is, add a where clause to the query to filter the users based on the username. The Op.like operator is used to perform a case-insensitive search for usernames that start with the specified value. This is useful for implementing autocomplete functionality in the client application.
      whereClause.username = {
        [Op.like]: `${req.query.username}%`, // The value of the username query parameter is used as the search value. The % symbol is a wildcard that matches any sequence of characters. This means that the query will match usernames that start with the specified value.
      };
    }
    const users = await User.findAll({ where: whereClause }); // Use the User model's findAll method to get all users from the database. This method returns a promise that resolves to an array of users. The where clause is used to filter the users based on the query parameters in the request.
    if (!users.length) {
      res.status(404).json({ message: "No users found" }); // If the array of users is empty (i.e., if there are no users in the database) then send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
      return; // End the function execution here. The following code will not be executed.
    }

    const usersResponse = users.map((user) => ({ id: user.id, username: user.username, createdAt: user.createdAt })); // Create a response array that includes the id, username, and createdAt timestamp for each user. This array will be sent back to the client in the response.

    res.status(200).json(usersResponse); // Send a 200 OK status code and the array of users in the response. The 200 status code indicates that the request was successful.
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};

// GET /api/users/:username route - This route retrieves a user by their username.
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract the username from the request parameters. This is the username that the client has included in the URL.
    const user = await User.findOne({ where: { username } }); // Use the User model's findOne method to get the user with the specified username from the database. This method returns a promise that resolves to the user if found, or null if not found.
    if (!user) {
      res.status(404).json({ message: `User with username ${username} not found` }); // If the user is not found (i.e., if user is null), send a 404 Not Found status code and a message in the response. The 404 status code indicates that the requested resource could not be found on the server.
      return; // End the function execution here. The following code will not be executed.
    }

    const userResponse = { id: user.id, username: user.username, createdAt: user.createdAt }; // Create a response object that includes the user's id, username, and createdAt timestamp. This object will be sent back to the client in the response.
    res.status(200).json(user); // Send a 200 OK status code and the userResponse object in the response. The 200 status code indicates that the request was successful.
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request parameters, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};

const getUserDetailsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ message: `User with username ${username} not found` });
      return;
    }

    const userResponse = user.toJSON(); // Convert the user object to a JSON object. This is done to remove the password from the user object before sending it in the response. The toJSON method is a built-in method of Sequelize models that returns a plain JSON representation of the model, removing any hidden fields (e.g., the password field).
    delete userResponse.password; // Remove the password from the userResponse object before sending it in the response. This is a security measure to prevent the user's password from being exposed to the client.

    res.status(200).json(userResponse);
    return;
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message } });
    return;
  }
};

// PUT /api/users/:username route - This route updates a user by their username.
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
      updateMessage.push(`Username updated from ${oldUsername} to ${username}`); // Add a message to the updateMessage array indicating that the username has been updated.
    }
    if (req.emailChanged) {
      email = req.body.email; // If the email has been changed, update the email variable with the new email from the request body.
      updateMessage.push(`Email updated from ${req.user.email} to ${email}`); // Add a message to the updateMessage array indicating that the email has been updated.
    }
    if (req.passwordChanged) {
      updateMessage.push(`Password updated`); // If the password has been changed, add a message to the updateMessage array indicating that the password has been updated.
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

    res.status(500).json({ error: { name: error.name, message: error.message } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the User model, a problem with the request body, or a problem with the server itself.
    return; // End the function execution here. The following code will not be executed.
  }
};

// DELETE /api/users/:username route
const deleteUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = req.user;

    if (user.username !== username) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    await User.destroy({ where: { username } });
    res.status(200).json({ message: `User with username ${username} deleted` });
    return; // End the function execution here. The following code will not be executed.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message } });
    return; // End the function execution here. The following code will not be executed.
  }
};

// Export the functions
module.exports = {
  signup,
  login,
  getAllUsers,
  getUserByUsername,
  getUserDetailsByUsername,
  updateUserByUsername,
  deleteUserByUsername,
}; // Export the controller functions for use in other files. These functions handle the logic for the different routes. Each function corresponds to a specific route and HTTP method, and contains the logic to handle requests to that route.
