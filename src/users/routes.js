// Importing External Dependencies
const { Router } = require("express"); // Import the Router constructor from the express module. This constructor is used to create new router objects. Each router object is an isolated instance of middleware and routes. You can think of it as a "mini-application," capable only of performing middleware and routing functions.

// Importing Internal Dependencies
const {
  signup,
  login,
  getAllUsers,
  getUserByUsername,
  getUserDetailsByUsername,
  updateUserByUsername,
  deleteUserByUsername,
} = require("./controllers"); // Import the controller functions from the controllers.js file. These functions handle the logic for the different routes. Each function corresponds to a specific route and HTTP method, and contains the logic to handle requests to that route.
const { hashPassword, comparePassword } = require("../middleware/auth"); // Import the authentication middleware functions from the auth.js file. These functions are used to hash and compare passwords. The hashPassword function is used to securely hash a password before storing it in the database, and the comparePassword function is used to compare a hashed password with a plain-text one, such as when validating user credentials during login.
const { verifyToken } = require("../middleware/verifyToken"); // Import the verifyToken middleware function from the verifyToken.js file. This function is used to verify the user's token and authenticate the user. It is used to protect routes that require authentication, such as the user profile or settings page. The middleware checks the request headers for a valid JWT, decodes the token using the secret key, retrieves the user from the database, and attaches the user's data to the request object. If the token is not valid or the user does not exist, the middleware sends a 401 Unauthorized status code in the response. This middleware is used in the route definitions to perform token verification before the route handlers are called.
const {
  validateUsername,
  checkUsernameChanged,
  validateEmail,
  checkEmailChanged,
  validatePassword,
  checkPasswordChanged,
} = require("../middleware/validation"); // Import the validation middleware functions from the validation.js file. These functions are used to validate user input and perform checks before updating user data. For example, the fetchUser function retrieves a user from the database, the checkUsernameChanged function checks if the username has been changed, and the checkEmailChanged function checks if the email has been changed.
const { getUserBooks } = require("../books/controllers"); // Import the getUserBooks controller function from the books/controllers.js file. This function retrieves the books associated with a user from the database.

// Router Initializations
const userRouter = Router(); // Initialize a new router object for user-related routes. This object will be used to define routes related to users. Each route will be attached to this router object and will be relative to the path where this router is used in the main server file.
const signupRouter = Router(); // Initialize a new router object for the signup route. This object will be used to define the signup route. The signup route is responsible for creating new users and starting a new session.
const loginRouter = Router(); // Initialize a new router object for the login route. This object will be used to define the login route. The login route is responsible for authenticating users and starting a new session.

// Routes
// User Routes
userRouter.get("/", verifyToken, getAllUsers); // Define a GET route at the path "/". When this route is hit, the getAllUsers controller function is called. This function retrieves all users from the database and sends them in the response.
userRouter.get("/:username", getUserByUsername); // Define a GET route at the path "/:username". When this route is hit, the getUserByUsername controller function is called. This function retrieves a user with the specified username from the database and sends it in the response.
userRouter.get("/:username/account", verifyToken, getUserDetailsByUsername);
userRouter.get("/:username/books", verifyToken, getUserBooks);
userRouter.put(
  "/:username",
  verifyToken,
  validateUsername,
  checkUsernameChanged,
  validateEmail,
  checkEmailChanged,
  checkPasswordChanged,
  hashPassword,
  updateUserByUsername
); // Define a PUT route at the path "/:username". When this route is hit, the tokenCheck middleware function is called first, then the fetchUser middleware function is called, then the checkUsernameChanged middleware function is called, then the validateEmailFormat middleware function is called, then the checkEmailChanged middleware function is called, then the checkPasswordChanged middleware function is called, then the hashPassword middleware function is called, then the updateUserByUsername controller function is called. This function updates the user with the specified username in the database and sends the updated user in the response.
userRouter.delete("/:username", verifyToken, comparePassword, deleteUserByUsername); // Define a DELETE route at the path "/:username". When this route is hit, the deleteUserByUsername controller function is called. This function deletes the user with the specified username from the database and sends a success message in the response.
// Sign up Route
signupRouter.post("/", validateUsername, validateEmail, validatePassword, hashPassword, signup); // Define a POST route at the path "/". When this route is hit, the hashPassword middleware function is called first, then the signup controller function is called. The hashPassword function hashes the password from the request body, and the signup function creates a new user with the hashed password and starts a new session.
// Login Route
loginRouter.get("/verify", verifyToken, login); // Define a GET route at the path "/authCheck". When this route is hit, the tokenCheck middleware function is called first, then the login controller function is called. The tokenCheck function checks if the user has a valid token, and the login function starts a new session if the token is valid.
loginRouter.post("/", validateEmail, comparePassword, login); // Define a POST route at the path "/". When this route is hit, the comparePassword middleware function is called first, then the login controller function is called. The comparePassword function compares the password from the request body with the hashed password in the database, and the login function starts a new session if the passwords match.

// Export userRouter
module.exports = {
  userRouter,
  signupRouter,
  loginRouter,
}; // Export the userRouter object for use in other files. This object contains the defined routes and can be used in the main server file to handle incoming requests. This allows us to separate our routes into different files, which can make the code easier to understand and maintain.
