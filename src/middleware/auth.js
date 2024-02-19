//
const bcrypt = require("bcrypt");

const User = require("../users/model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    req.body.password = hashedPassword;
    console.log(hashedPassword);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the hashPassword middleware function.
module.exports = { hashPassword };

// const salt = await bcrypt.genSalt(saltRounds);
