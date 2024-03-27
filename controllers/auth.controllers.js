const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { connectDB, runQuery } = require("../database/db.config");
const { insertSignup } = require("../database/sqlcommands");
const { checkEmailLogin } = require("../database/sqlcommands");
const ErrorResponse = require("../helper/errorResponse");
const { authpassword, hash, genToken } = require("../helper/authentication");

const signup = async (req, res, next) => {
  // generate a random id using uuid
  const cus_id = uuidv4();

  // create a salt using the hash function created in the helper file
  const salt = hash();

  try {
    // get the users credential from the request
    const credentials = {
      cus_id,
      fullname: req.body.fullname,
      email: req.body.email,
      userpassword: req.body.userpassword,
    };

    // create a connection, await is used beacuse it
    const connection = await connectDB();

    // create a variable that holds regex form of an email
    const validEmailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


      // check that the email entered corresponds with the regex format set
    if (!validEmailRegex.test(credentials.email)) {
      return next(new ErrorResponse("Invalid email format", 400));
    }


    // check that the length of the password entered is not less than 6 characters 
    if (credentials.userpassword.length < 6) {
      return next(
        new ErrorResponse("Password must be at least 6 characters long", 401)
      );
    }

    // hash the passwprd entered using the function created to hash
    credentials.userpassword = authpassword(salt, req.body.userpassword);

    // use the function created for running a query to insert the credentials gotten from the request into the database
    const result = await runQuery(connection, insertSignup, [
      credentials.cus_id,
      credentials.fullname,
      credentials.email,
      credentials.userpassword,
      salt,
    ]);

    // send a successful message to the client sde
    return res
      .status(200)
      .json({
        status: true,
        data: result,
        message: "Account created successfully",
      });


  } catch (err) {

    // handle errors using sql error message
    return next(err);
  }
};

const login = async (req, res, next) => {

  // get credentials entered during login
  const credentials = {
    email: req.body.email,
    userpassword: req.body.userpassword,
  };

  try {

    // create connection to database
    const connection = await connectDB();

    // run a query to confirm the email enetered exists in the database
    const checkUser = await runQuery(connection, checkEmailLogin, [ credentials.email ]);

    // handle the case of an empty result from the query
    if (checkUser.length === 0) {
      return next(new ErrorResponse("Account does not exist. Signup", 409));
    }

    // retrieve the salt stored in the database
    const salt = checkUser[0].salt;

    // hash the password entered during login using the salt retrieved from database
    const hashedPassword = authpassword(salt, credentials.userpassword);

    console.log(checkUser[0].userpassword);
    console.log(hashedPassword);

    // check that the hashed password in the previuos line of code is identical to the one stored in the database
    if (checkUser[0].userpassword != hashedPassword) {
      return next(new ErrorResponse("Wrong Password", 401));
    }

    // generate a token for the user using the genToken function created in the helper file
    const authToken = genToken(checkUser[0].cus_id);

    // send a successful login message to the client side
    res
      .status(200)
      .json({ status: true, message: "Login successful", authToken });
  } catch (err) {
    // handle error using the inbult error details
    return next(err);
  }
};

module.exports = { login, signup };
