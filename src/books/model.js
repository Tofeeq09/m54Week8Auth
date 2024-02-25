// Importing External Dependencies
const { DataTypes } = require("sequelize"); // Import the DataTypes object from the sequelize module. This object provides data types that you can use to define what type of data a particular column can hold in the database. DataTypes include STRING, INTEGER, BOOLEAN, DATE, etc.

// Importing Internal Dependencies
const sequelize = require("../db/connection"); // Import the sequelize instance from the connection.js file. This instance is configured with the database connection parameters and can be used to define models and run queries. By using this instance, we ensure that all queries run on the same database connection.

// Define the Book model
const Book = sequelize.define(
  "Book", // Define the name of the model. This name will be used to create the table in the database. Sequelize will automatically pluralize this name to form the table name.
  {
    // Define the model attributes. Each attribute represents a column in the table. The key is the column name and the value is an object that defines the column properties.
    title: {
      type: DataTypes.STRING, // The title is a string data type. This means that the title column can hold string data. The STRING data type can hold any kind of text data.
      allowNull: false, // The title cannot be null. This means that the title column must always have a value. This is enforced at the database level.
    },
    author: {
      type: DataTypes.STRING, // The author is a string data type. This means that the author column can hold string data. The STRING data type can hold any kind of text data.
      allowNull: false, // The author cannot be null. This means that the author column must always have a value. This is enforced at the database level.
    },
    genre: {
      type: DataTypes.STRING, // The genre is a string data type. This means that the genre column can hold string data. The STRING data type can hold any kind of text data.
      allowNull: false, // The genre cannot be null. This means that the genre column must always have a value. This is enforced at the database level.
    },
  }
);

// Define the Genre model
const Genre = sequelize.define("Genre", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Export the Book & Genre models
module.exports = {
  Book,
  Genre,
}; // Export the Book and Genre models for use in other files. These models can be used to define the schema for the books and genres tables in the database. By exporting them, we can use the same models throughout our application, which is more efficient than defining new models for each query.
