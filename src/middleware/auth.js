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
    const { password } = req.body; // Extract the password (a string data type) from the request body (an object data type) using object destructuring. This is the password that the user has entered in the signup form.
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password using bcrypt. The function bcrypt.hash() takes the plaintext password and the salt rounds as arguments and returns a promise that resolves to the hashed password. The hashing process involves generating a salt using the specified salt rounds and then hashing the password with this salt.
    req.body.password = hashedPassword; // Replace the plaintext password in the request body with the hashed password. This ensures that only the hashed password is stored in the database, not the plaintext password. This is important for security reasons, as storing plaintext passwords can lead to serious security breaches if the database is compromised.

    next(); // Call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(500).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 500 Internal Server Error status code and the error message in the response. This could be due to a problem with the bcrypt library, a problem with the request body, or a problem with the server itself.
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
    console.log(req.header("Authorization"));
    // 1. check request headers - does Authorization exist

    if (!req.header("Authorization")) {
      throw new Error("No token passed");
    }

    // 2. get the JWT from the headers

    const token = req.header("Authorization").replace("Bearer ", "");

    // 3. decode the token using SECRET

    const decodedToken = jwt.verify(token, process.env.SECRET);

    // 4. get user with id

    const user = await User.findOne({ where: { id: decodedToken.id } });

    // 5. if !user send 401 response

    if (!user) {
      res.status(401).json({ message: "not authorized" });
      return;
    }

    // 6. pass on user data to login function

    req.authCheck = user;

    next();
  } catch (error) {
    res.status(501).json({ error: { name: error.name, message: error.message, stack: error.stack } });
  }
};

// Export the hashPassword and comparePassword middleware functions
module.exports = { hashPassword, comparePassword, tokenCheck }; // Export the hashPassword and comparePassword middleware functions for use in other files. These functions can be used in the route definitions to perform password hashing and comparison before the route handlers are called.

// Status code 401 is used when a user is not authorized to access a resource.
// Status code 402 is used when a user needs to authenticate to access a resource.
// Status code 403 is used when a user is authenticated but not authorized to access a resource.
