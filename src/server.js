// Importing External Dependencies - These are libraries or frameworks installed via npm, which provide functionality to our application.
require("dotenv").config(); // Load environment variables from a .env file into process.env. This is done using the dotenv package, which reads the .env file in your project root and initializes those values as environment variables. It's a useful tool for managing sensitive data (like API keys) that should not be included in version control.
const express = require("express"); // Import Express.js, a web application framework for Node.js. Express simplifies the process of building web applications by providing a simple and flexible API for defining routes, handling requests, and sending responses.
const cors = require("cors"); // Import the CORS middleware, which is used to enable Cross-Origin Resource Sharing. This is necessary for allowing requests from the client application, which may be running on a different domain or port.

// Importing Internal Dependencies - These are modules or components from our application's source code, which we've defined to structure our application.

const sequelize = require("./db/connection"); // Import the sequelize instance from the connection.js file. This instance is configured with the database connection parameters and can be used to define models and run queries. By using this instance, we ensure that all queries run on the same database connection.
const { userRouter, signupRouter, loginRouter } = require("./users/routes"); // Import the routers for the user, login & signup routes from the users/routes.js file. This router defines the endpoint for the login operation, which authenticates a user and starts a new session.
const User = require("./users/model"); // Import the User model from the users/model.js file. This model represents the users table in the database. It defines the schema for the table and provides methods for interacting with the table.

const { Book } = require("./books/model"); // Import the Book and Genre models from the books/model.js file. These models represent the books and genres tables in the database. They define the schema for the tables and provide methods for interacting with the tables.
const { bookRouter } = require("./books/routes"); // Import the router for the book routes from the books/routes.js file. This router defines the endpoints for the book operations, such as adding, updating, and deleting books.

// Environment Variables
const port = process.env.PORT || 5001; // Set the port for the server to listen on. This is either the PORT environment variable (if it is set) or 5001. The PORT environment variable is often set by deployment environments, while 5001 is a common default for local development.

// Initializations
const app = express(); // Initialize a new Express.js application. This application object is used to set up the middleware and routes. Express.js is a minimalist web application framework for Node.js, providing a robust set of features for building single and multi-page, and hybrid web applications.
const apiRouter = express.Router(); // Initialize a new router. This router will be used to define the API routes. The Router is like a mini Express application, capable of performing middleware and routing functions. Each router effectively acts as a middleware itself.

app.use(
  // Use the built-in Express.js middleware for setting HTTP headers. This middleware is used to set the Access-Control-Allow-Origin header, which controls which origins are allowed to access the server. This is necessary for allowing requests from the client application, which may be running on a different domain or port.
  cors() // Enable Cross-Origin Resource Sharing (CORS) for all routes. This middleware sets the Access-Control-Allow-Origin header to *, allowing requests from any origin. This is a common configuration for public APIs, but it can be customized to allow requests from specific origins.
);

// Middleware Setup
app.use(express.json()); // Use the built-in Express.js middleware for parsing JSON. This allows us to access the body of HTTP requests in req.body. This is particularly useful when handling POST or PUT requests where the request body often contains the data we need.

// Mounting apiRouter on app
app.use("/api", apiRouter); // Mount the apiRouter on the path "/api". This means that any route defined in apiRouter will be prefixed with "/api". This is a common pattern in Express.js applications to prefix all API routes with "/api" to distinguish them from other routes, such as those serving static files or client-side applications.
// Mounting routers on apiRouter
apiRouter.use("/users", userRouter); // Mount the UserRouter on the path "/users". This means that any route defined in UserRouter will be prefixed with "/users". This is a common pattern in Express.js applications to modularize routes and make the code more maintainable.
apiRouter.use("/signup", signupRouter); // Mount the SignupRouter on the path "/signup". This means that any route defined in SignupRouter will be prefixed with "/signup". This allows us to group all signup-related routes together, which can make the code easier to understand and maintain.
apiRouter.use("/login", loginRouter); // Mount the LoginRouter on the path "/login". This means that any route defined in LoginRouter will be prefixed with "/login". This allows us to group all login-related routes together, which can make the code easier to understand and maintain.
apiRouter.use("/books", bookRouter); // Mount the BookRouter on the path "/books". This means that any route defined in BookRouter will be prefixed with "/books". This allows us to group all book-related routes together, which can make the code easier to understand and maintain.

// Health Check
app.get("/health", (req, res) => {
  // Define a health check route at the path "/health". This is a simple GET route that can be used to check if the server is running. Health check routes are common in web applications, and they are often used by deployment environments, load balancers, and other parts of the system to check the status of the application. If the server is running and able to handle requests, it should respond to a GET request at this path with a status code of 200 and a success message.

  res.status(200).json({ message: "Server is running" }); // Respond with a status code of 200 and a JSON object containing a success message. The status() method sets the HTTP status for the response. It is chainable, allowing us to call another method (in this case, json()) on the same line. The json() method sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using JSON.stringify().
});

// Sync Tables
const syncTables = async () => {
  // Define an asynchronous function to synchronize the database tables with the models defined in our application.This function is called when the server starts, ensuring that our database schema matches the models we've defined in code. This is particularly useful during development, as it allows us to modify our models and have those changes reflected in the database without having to manually alter the database schema.

  // Define relationships
  User.belongsToMany(Book, { through: "UserBooks" });
  Book.belongsToMany(User, { through: "UserBooks" });

  // Sync models with database
  await User.sync();
  await Book.sync();
  await sequelize.models.UserBooks.sync();
};

// Server
app.listen(port, () => {
  // Start the server. The server listens for HTTP requests on the specified port. The app.listen() method is a convenience method for creating a net.Server object and calling server.listen() on it. The net.Server object is an EventEmitter that emits a 'listening' event when the server is ready to accept connections.

  syncTables(); // This function is asynchronous and returns a Promise. It uses the Sequelize sync() method to automatically create the database table for our User model if it doesn't exist. The sync() method can also automatically update the table if the model changes, but this can be dangerous in a production environment because it can result in data loss.
  console.log(`Server is running on port ${port}`); // This message is logged when the 'listening' event is emitted, indicating that the server is ready to accept connections. // It's important to log this message so that we know the server has started successfully and is ready to accept connections.
});
