const bcrypt = require("bcryptjs");
const { connectDB, runQuery } = require("../database/db.config");
const { insertSignup } = require("../database/sqlcommands");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { checkEmailLogin } = require("../database/sqlcommands");
const ErrorResponse = require("../helper/errorResponse");
const { authpassword, hash, genToken } = require("../helper/authentication");

const signup = async (req, res, next) => {
  const cus_id = uuidv4();

  const salt = hash();

  // console.log(authpassword("tytuyutyt","jkjkbkbj"));

  try {
    const credentials = {
      cus_id,
      fullname: req.body.fullname,
      email: req.body.email,
      userpassword: req.body.userpassword,
    };

    const connection = await connectDB();

    const validEmailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!validEmailRegex.test(credentials.email)) {
      return next(new ErrorResponse("Invalid email format", 400));
    }

    // if (!validEmailRegex.test(credentials.email)) {
    //      return res.status(400).json({ message: "Invalid email format" });
    // }

    if (credentials.userpassword.length < 6) {
      return next(new ErrorResponse("Password must be at least 6 characters long", 401))
    }

    credentials.userpassword = authpassword(salt, req.body.userpassword)

    const result = await runQuery(connection, insertSignup, [
      credentials.cus_id,
      credentials.fullname,
      credentials.email,
      credentials.userpassword,
      salt,
    ]);



    return res.status(200).json({ status: true, data: result, message: "Account created successfully" });


  } catch (err) {
    // handle errors using sql error message
    return next(err);
  }
};

const login = async (req, res, next) => {
  const credentials = {
    email: req.body.email,
    userpassword: req.body.userpassword,
  };

  // const secretKey = process.env.JWT_SECRET;

  try {
    const connection = await connectDB();

    const checkUser = await runQuery(connection, checkEmailLogin, [
      credentials.email,
    ]);

    if (checkUser.length === 0) {
      return next(new ErrorResponse("Account does not exist. Signup", 409));
    }

    const salt = checkUser[0].salt;

    const hashedPassword = authpassword(salt, credentials.userpassword);

    // const checkPwd = await bcrypt.compare(credentials.userpassword, hashedPassword)

    if (checkUser[0].userpassword != hashedPassword) {
      return next(new ErrorResponse("Wrong Password", 401));
    }

    const authToken = genToken(checkUser[0].cus_id);

    res
      .status(200)
      .json({ status: true, message: "Login successful", authToken });



  } catch (err) {
    return next(err);
  }
};

module.exports = { login, signup };
