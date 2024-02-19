// External Dependencies
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

// Internal Dependencies
const sequelize = require("../db/connection");

// Define the User model.
const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      // validate: {
      //   isEmail: true,
      // },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // beforeCreate: async (user) => {...}: This is a hook that Sequelize will call before a new user is created.
      // The user object that's about to be created is passed to the function.

      // (user): This is the parameter list for the arrow function. In this case, there's just one parameter: user.
      // When Sequelize calls this function, it will pass the instance of the User model that's about to be created to this function.

      // if (user.password) {...}: This checks if a password is provided. If not, the function doesn't do anything.

      // const salt = await bcrypt.genSalt(10): This generates a new salt using bcrypt.
      // A salt is random data that's used as an additional input to a one-way function that hashes data, a password in this case.
      // The number 10 here defines the cost factor. It determines how much time is needed to calculate a single BCrypt hash.
      // The higher the cost factor, the more hashing rounds are made, increasing the time it takes to generate the hash and thus the security.
      // See server.js for further information on the cost factor.

      // user.password = await bcrypt.hash(user.password, salt): This hashes the user's password with the generated salt using bcrypt.
      // The hashed password is then stored in the user object, replacing the plain text password.
      // When the user object is saved to the database, the hashed password is what gets stored.

      afterCreate: async (user) => {
        console.log(`New user created with id ${user.id} and username ${user.username}`);
      },
    },
  }
);

// Export the User model.
module.exports = User;
