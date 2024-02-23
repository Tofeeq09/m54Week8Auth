// Importing External Dependencies
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library, which provides functions for creating and verifying JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.

// Importing Internal Dependencies
const User = require("../users/model"); // Import the User model from the users module, which defines the structure of user data in the database. This model represents the users table in the database and provides methods for querying this table.

// Token Verification Middleware Function

// GET /api/login/verify route
// PUT /api/users/:username route
// DELETE /api/users/:username route
const verifyToken = async (req, res, next) => {
  try {
    // console.log(req.header("Authorization"));

    // 1. Check request headers - does Authorization exist
    if (!req.header("Authorization")) {
      throw new Error("No token passed"); // If the Authorization header is not present in the request, throw an error. This is how we check if the user has provided a token in the request.
    }

    // 2. Get the JWT from the headers
    const token = req.header("Authorization").replace("Bearer ", ""); // Extract the JWT from the Authorization header. The Authorization header is used to send credentials in the form of a JWT. The replace() method is used to remove the "Bearer " prefix from the JWT. This is how we extract the JWT from the header.

    // 3. Decode the token using SECRET
    const decodedToken = jwt.verify(token, process.env.SECRET); // Decode the JWT using the secret key. The jwt.verify() function takes the JWT and the secret key as arguments and returns the decoded payload if the token is valid. This is how we verify the user's token.

    // 4. Initialize a variable user with no value.
    let user;

    // 5. Check if username is present in the request parameters: If username is present in the request parameters:
    //      Use the findOne method of the User model to find a user in the database where the id matches the id from the decoded token and the username matches the username from the request parameters.
    //      Assign the result of the findOne method to the user variable. This operation is asynchronous, so use the await keyword to wait for it to complete.
    if (req.params.username) {
      user = await User.findOne({ where: { id: decodedToken.id, username: req.params.username } }); // If the username is present in the request parameters, find a user in the database where the id matches the id from the decoded token and the username matches the username from the request parameters. This is how we verify that the user is authorized to access the protected route.
      // 6. If username in the request parameters doesn't match the username associated with the token:
      if (!user) {
        throw new Error("Username in the request parameters doesn't match the username associated with the token"); // If no user is found, throw an error. This is how we check if the user is authorized to access the protected route.
      }
    }

    // 6. Check if username is present in the request parameters: If username is not present in the request parameters:
    //      Use the findOne method of the User model to find a user in the database where the id matches the id from the decoded token.
    //      Assign the result of the findOne method to the user variable. This operation is asynchronous, so use the await keyword to wait for it to complete.
    if (!req.params.username) {
      user = await User.findOne({ where: { id: decodedToken.id } }); // If the username is not present in the request parameters, find a user in the database where the id matches the id from the decoded token. This is how we verify that the user is authorized to access the protected route.
    }

    // 8. If !user send 401 response
    if (!user) {
      res.status(401).json({ message: "Unauthorized" }); // If no user is found, send a 401 Unauthorized status code and a message in the response. This means that the user is not authorized to access the protected route.
      return; // Return early to prevent the next() function from being called. This stops the middleware chain and prevents the route handler from being called.
    }

    // 9. pass on user data to login function
    req.user = user; // If the user is found, attach the user's data to the request object. This is how we authenticate the user and start a new session.
    req.verify = user; // If the user is found, attach the user's data to the request object. This is how we authenticate the user and start a new session.

    next(); // If the user is found, call the next middleware function or the route handler in the stack. This could be another middleware function that performs additional processing, or it could be the route handler that responds to the request.
  } catch (error) {
    res.status(501).json({ error: { name: error.name, message: error.message, stack: error.stack } }); // If an error occurs, send a 501 Not Implemented status code and the error message in the response. This could be due to a problem with the jwt library, a problem with the User model, a problem with the request headers, or a problem with the server itself.
    return; // Return early to prevent the next() function from being called. This stops the middleware chain and prevents the route handler from being called.
  }
};

module.exports = { verifyToken }; // Export the tokenCheck middleware function for use in other files. This function can be used in the route definitions to perform token verification before the route handlers are called.
