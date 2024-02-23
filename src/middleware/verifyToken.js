// Verify Token Middleware - This middleware function is used to verify the user's token and authenticate the user. It is used to protect routes that require authentication, such as the user profile or settings page. The middleware checks the request headers for a valid JWT, decodes the token using the secret key, retrieves the user from the database, and attaches the user's data to the request object. If the token is not valid or the user does not exist, the middleware sends a 401 Unauthorized status code in the response. This middleware is used in the route definitions to perform token verification before the route handlers are called.
const verifyToken = async (req, res, next) => {
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

    //
    req.user = user; // Attach the user's data to req.user
    //
    req.authCheck = user; // If the user is found, attach the user's data to the request object. This is how we authenticate the user and start a new session.

    next(); // If the user is found, call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(501).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 501 Not Implemented status code and the error message in the response. This could be due to a problem with the jwt library, a problem with the User model, a problem with the request headers, or a problem with the server itself.
  }
};

module.exports = { verifyToken }; // Export the tokenCheck middleware function for use in other files. This function can be used in the route definitions to perform token verification before the route handlers are called.
