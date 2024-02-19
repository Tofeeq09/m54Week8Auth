// External Dependencies
const { Sequelize } = require("sequelize");

// New Instance of Sequelize
const sequelize = new Sequelize(process.env.MYSQL_URI);

// Test the connection
sequelize.authenticate();

// Indicate the connection has been established
console.log("Connection has been established successfully.");

// Export the sequelize instance
module.exports = sequelize;
