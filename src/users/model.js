// External Dependencies
const { DataTypes } = require("sequelize");

// Internal Dependencies
const sequelize = require("../db/connection");

const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
