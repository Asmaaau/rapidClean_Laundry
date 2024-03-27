const bcrypt = require("bcryptjs");
const { connectDB, runQuery } = require("../database/db.config");
const { checkEmailLogin, updateLogin } = require("../database/sqlcommands");
const { authpassword, hash } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");

const resetPasssword = async (req, res, next) => {
  try {
    // get credentials
    const credentials = {
      email: req.body.email,
      userpassword: req.body.userpassword,
    };

    // generate a salt value using the hash function
    const salt = hash();

    //hash the new password
    credentials.userpassword = authpassword(salt, req.body.userpassword);

     // create connection to database
    const connection = await connectDB();

     // run query to check that email exists in database
    const checkEmail = await runQuery(connection, checkEmailLogin, [
      credentials.email,
    ]);

     // handle false result
    if (checkEmail.length === 0) {
      return next(new ErrorResponse("Account does not exist. Signup", 401));
    }

     // update password and salt using query
    const updatePWD = await runQuery(connection, updateLogin, [
      credentials.userpassword,
      salt,
      credentials.email,
    ]);

     // send successful reset message to client side
    return res
      .status(200)
      .json({ message: "Password has been reset successfully. Back to Login" });
  } catch (err) {

     // handle error
    console.error("Error during reset:", err);
    return next(err);
  }
};

module.exports = { resetPasssword };
