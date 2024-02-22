// Importing External Dependencies
const bcrypt = require("bcrypt"); // Import the bcrypt library, which provides cryptographic functions for password hashing. Bcrypt is a password-hashing function designed by Niels Provos and David Mazières, specifically to protect against multi-GPU password cracking attacks.
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library, which provides functions for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.

// Importing Internal Dependencies
const User = require("../users/model"); // Import the User model from the users module, which defines the structure of user data in the database. This model represents the users table in the database and provides methods for querying this table.

// Environment Variables
const saltRounds = parseInt(process.env.SALT_ROUNDS); // Get the number of salt rounds from environment variables and convert it to an integer. Salt rounds determine the complexity of the hash, affecting the time it takes to generate. The higher the number, the more secure the hash, but also the more time it takes to generate.

// Middleware Functions
// Hash the password middleware for the POST /signup route
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body; // Extract the password from the request body using object destructuring. This is the password that the user has entered in the signup form.
    if (password && req.passwordChanged !== false) {
      // The condition if (password && (req.passwordChanged !== false)) checks two things:
      // 1. password: This checks if a password is provided in the request body. If req.body.password is undefined, null, an empty string, or any other falsy value, this part of the condition will be false and the password won't be hashed.
      // 2. req.passwordChanged !== false: This checks if req.passwordChanged is not false. This part of the condition will be true in two cases:
      // A. In the signup route, where req.passwordChanged is undefined because the checkPasswordChanged middleware is not used.
      // B. In the update route, where req.passwordChanged is true because the checkPasswordChanged middleware has determined that the password has changed.

      // So, the password will be hashed in the following cases:
      // In the signup route, if a password is provided.
      // In the update route, if a password is provided and it has changed.

      const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password using the bcrypt.hash() function. This function takes the password and the number of salt rounds as arguments and returns a promise that resolves to the hashed password. The saltRounds variable is used to determine the complexity of the hash, affecting the time it takes to generate. The higher the number, the more secure the hash, but also the more time it takes to generate.
      req.body.password = hashedPassword; // Replace the plaintext password in the request body with the hashed password. This is how we securely store the password in the database.
    }

    next(); // Call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the bcrypt library, a problem with the User model, a problem with the request body, or a problem with the server itself.
  }
};
// Compare the password middleware for the POST /login route
const comparePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Extract the email and password (both string data types) from the request body (an object data type) using object destructuring. These are the credentials that the user has entered in the login form.
    const user = await User.findOne({ where: { email } }); // Find the user by email. The function User.findOne() takes an object with a where property that specifies the condition to match. It returns a promise that resolves to the first user that matches the condition or null if no user matches. This is how we retrieve the user's data from the database.
    if (!user) {
      res.status(404).json({ message: "User not found" }); // If no user is found, send a 404 Not Found status code and a message in the response. This means that there is no user in the database with the entered username.
      return; // Return early to prevent the next() function from being called. This stops the middleware chain and prevents the route handler from being called.
    }

    const match = await bcrypt.compare(password, user.password); // Compare the plaintext password with the hashed password stored in the user object. The function bcrypt.compare() takes the plaintext password and the hashed password as arguments and returns a promise that resolves to a boolean indicating whether the passwords match. This is how we verify the user's password.
    if (!match) {
      res.status(401).json({ message: "Password is incorrect" }); // If the passwords don't match, send a 401 Unauthorized status code and a message in the response. This means that the entered password does not match the password in the database for the entered username.
      return; // Return early to prevent the next() function from being called. This stops the middleware chain and prevents the route handler from being called.
    }

    req.user = user; // If the passwords match, attach the user's data to the request object. This is a placeholder for the actual login logic, which would involve generating a session or token. This is how we authenticate the user and start a new session.

    next(); // If the passwords match, call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the bcrypt library, a problem with the User model, a problem with the request body, or a problem with the server itself.
  }
};
// Token check middleware for the GET /authCheck route
const tokenCheck = async (req, res, next) => {
  try {
    // console.log(req.header("Authorization"));
    // 1. check request headers - does Authorization exist

    if (!req.header("Authorization")) {
      throw new Error("No token passed"); // If the Authorization header is not present in the request, throw an error. This is how we check if the user has provided a token in the request.
    }

    // 2. get the JWT from the headers

    const token = req.header("Authorization").replace("Bearer ", ""); // Extract the JWT from the Authorization header. The Authorization header is used to send credentials in the form of a JWT. The replace() method is used to remove the "Bearer " prefix from the JWT. This is how we extract the JWT from the header.

    // 3. decode the token using SECRET

    const decodedToken = jwt.verify(token, process.env.SECRET); // Decode the JWT using the secret key. The jwt.verify() function takes the JWT and the secret key as arguments and returns the decoded payload if the token is valid. This is how we verify the user's token.

    // 4. get user with id

    const user = await User.findOne({ where: { id: decodedToken.id } }); // Find the user by ID. The function User.findOne() takes an object with a where property that specifies the condition to match. It returns a promise that resolves to the first user that matches the condition or null if no user matches. This is how we retrieve the user's data from the database.

    // 5. if !user send 401 response

    if (!user) {
      res.status(401).json({ message: "not authorized" }); // If no user is found, send a 401 Unauthorized status code and a message in the response. This means that the token is not valid or the user does not exist in the database.
      return; // Return early to prevent the next() function from being called. This stops the middleware chain and prevents the route handler from being called.
    }

    // 6. pass on user data to login function

    req.authCheck = user; // If the user is found, attach the user's data to the request object. This is how we authenticate the user and start a new session.

    next(); // If the user is found, call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(501).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 501 Not Implemented status code and the error message in the response. This could be due to a problem with the jwt library, a problem with the User model, a problem with the request headers, or a problem with the server itself.
  }
};

// Export the hashPassword and comparePassword middleware functions
module.exports = { hashPassword, comparePassword, tokenCheck }; // Export the hashPassword and comparePassword middleware functions for use in other files. These functions can be used in the route definitions to perform password hashing and comparison before the route handlers are called.

// Status code 401 is used when a user is not authorized to access a resource.
// Status code 402 is used when a user needs to authenticate to access a resource.
// Status code 403 is used when a user is authenticated but not authorized to access a resource.
