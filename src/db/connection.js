// Importing External Dependencies
const { Sequelize } = require("sequelize"); // Import the Sequelize constructor from the sequelize module. Sequelize is a promise-based Node.js ORM (Object-Relational Mapping) that supports various SQL dialects including Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It provides a high-level abstraction for managing SQL databases.

// New Instance of Sequelize
const sequelize = new Sequelize(process.env.MYSQL_URI); // Create a new instance of Sequelize for our database connection. The connection URI is retrieved from the environment variables, which is a secure way to handle sensitive data like database credentials. This URI contains the username, password, host, port, and database name.

// Test the connection
sequelize.authenticate(); // Test the database connection by calling the authenticate() method on the sequelize instance. This method returns a promise that resolves if the connection is successfully established and rejects if there was an error. It's a good practice to test the connection before starting the server.

// Indicate the connection has been established
console.log("Connection has been established successfully."); // Log a success message to the console. This message will be displayed if the promise returned by sequelize.authenticate() resolves, indicating that the connection was successfully established. It's a simple way to confirm that our application is able to connect to the database.

// Export the sequelize instance
module.exports = sequelize; // Export the sequelize instance for use in other files. This instance is configured with the database connection parameters and can be used to define models and run queries. By exporting it, we can use the same connection throughout our application, which is more efficient than opening a new connection for each query.
