// Importing External Dependencies
const { DataTypes } = require("sequelize"); // Import the DataTypes object from the sequelize module. This object provides data types that you can use to define what type of data a particular column can hold in the database. DataTypes include STRING, INTEGER, BOOLEAN, DATE, etc.

// Importing Internal Dependencies
const sequelize = require("../db/connection"); // Import the sequelize instance from the connection.js file. This instance is configured with the database connection parameters and can be used to define models and run queries. By using this instance, we ensure that all queries run on the same database connection.

// Define the User model
const User = sequelize.define(
  "User", // Define the name of the model. This name will be used to create the table in the database. Sequelize will automatically pluralize this name to form the table name.
  {
    // Define the model attributes. Each attribute represents a column in the table. The key is the column name and the value is an object that defines the column properties.
    username: {
      type: DataTypes.STRING, // The username is a string data type. This means that the username column can hold string data. The STRING data type can hold any kind of text data.
      unique: true, // The username must be unique. This means that the database will not allow two rows to have the same username. This is enforced at the database level.
      allowNull: false, // The username cannot be null. This means that the username column must always have a value. This is also enforced at the database level.
    },
    email: {
      type: DataTypes.STRING, // The email is a string data type. This means that the email column can hold string data. The STRING data type can hold any kind of text data.
      unique: true, // The email must be unique. This means that the database will not allow two rows to have the same email. This is enforced at the database level.
      allowNull: false, // The email cannot be null. This means that the email column must always have a value. This is also enforced at the database level.
    },
    password: {
      type: DataTypes.STRING, // The password is a string data type. This means that the password column can hold string data. The STRING data type can hold any kind of text data.
      allowNull: false, // The password cannot be null. This means that the password column must always have a value. This is also enforced at the database level.
    },
  },
  {
    hooks: {
      // Define the model hooks. Hooks (also known as lifecycle events), are functions that are called before and after calls in Sequelize are executed. For example, if you want to always set a value on a field before saving it, you would use a beforeUpdate hook.

      // beforeCreate: async (user) => {
      //   if (user.password) {
      //     const salt = await bcrypt.genSalt(10);
      //     user.password = await bcrypt.hash(user.password, salt);
      //   }
      // },
      // beforeCreate: async (user) => {...}: This is a hook that Sequelize will call before a new user is created.
      // The user object that's about to be created is passed to the function.

      // (user): This is the parameter list for the arrow function. In this case, there's just one parameter: user.
      // When Sequelize calls this function, it will pass the instance of the User model that's about to be created to this function.

      // if (user.password) {...}: This checks if a password is provided. If not, the function doesn't do anything.

      // const salt = await bcrypt.genSalt(10): This generates a new salt using bcrypt.
      // A salt is random data that's used as an additional input to a one-way function that hashes data, a password in this case.
      // The number 10 here defines the cost factor. It determines how much time is needed to calculate a single BCrypt hash.
      // The higher the cost factor, the more hashing rounds are made, increasing the time it takes to generate the hash and thus the security.
      // Refer to the bcrypt documentation for more information on the cost factor.
      // ../middleware/auth.js has more information on bcrypt and the cost factor.

      // user.password = await bcrypt.hash(user.password, salt): This hashes the user's password with the generated salt using bcrypt.
      // The hashed password is then stored in the user object, replacing the plain text password.
      // When the user object is saved to the database, the hashed password is what gets stored.

      afterCreate: async (user) => {
        // This hook is called after a new user is created in the database. The 'user' parameter is an instance of the User model representing the newly created user. Hooks are functions that can run before or after certain sequelize lifecycle events.
        console.log(`New user created with id ${user.id} and username ${user.username}`); // Log a message to the console indicating the id and username of the newly created user. This can be useful for debugging and monitoring. It's a simple way to confirm that a new user was created successfully.
      },
    },
  }
);

// Export the User model
module.exports = User; // Export the User model for use in other modules. By exporting this model, we allow other parts of the application to import it and use it for various operations. This includes creating, reading, updating, and deleting records in the User table, as well as defining associations between the User model and other models. For example, if a User can have many Posts, we would need to import the User model into the Post model file to define this association.
