const { v4: uuidv4 } = require("uuid");
const { connectDB, runQuery } = require("../database/db.config");
const { insertSignup, updateVerify, updateEmailToken, checkEmailToken, checkEmailLogin } = require("../database/auth.sqlcommand");
const ErrorResponse = require("../helper/errorResponse");
const { authpassword, hash, genToken } = require("../helper/authentication");
const { sendMail } = require("../utils/sendMail");

const signup = async (req, res, next) => {
  // generate a random id using uuid
  const cus_id = uuidv4();

  // create a salt using the hash function created in the helper file
  const salt = hash();

  let checkUser;

  try {
    // get the users credential from the request
    const credentials = {
      cus_id,
      fullname: req.body.fullname,
      email: req.body.email,
      userpassword: req.body.userpassword,
    };

    // create a connection, await is used beacuse it is a promise
    const connection = await connectDB();

    // create a variable that holds regex form of an email
    const validEmailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    // check that the email entered corresponds with the regex format set
    if (!validEmailRegex.test(credentials.email)) {
      return next(new ErrorResponse("Invalid email format", 400));
    }

    // check that the password entered meets the requirements
    if (
      !(
        credentials.userpassword.length >= 8 &&
        /[A-Z]/.test(credentials.userpassword) &&
        /[a-z]/.test(credentials.userpassword) &&
        /[0-9]/.test(credentials.userpassword)
      )
    ) {
      return next(
        new ErrorResponse("Password does not meet the requirements", 401)
      );
    }

    // hash the password entered using the function created to hash
    credentials.userpassword = authpassword(salt, req.body.userpassword);


      // run a query to check if the email enetered already exists in the database but isVerified is false  
      checkUser = await runQuery(connection, checkEmailLogin, [
        credentials.email,
      ]);

      // if(checkUser.length > 0 && checkUser[0].email === credentials.email && checkUser[0].isVerified === false){
      //   await resendVerification()
      //   // send a successful message to the client sde
      //   return res.status(200).json({
      //     status: true,
      //     message: "Account created successfully",
      //   });
      // }

    // create the emailToken using the hash() method
    const emailToken = hash();

    // use the function created for running a query to insert the credentials gotten from the request into the database
    const result = await runQuery(connection, insertSignup, [
      credentials.cus_id,
      credentials.fullname,
      credentials.email,
      credentials.userpassword,
      salt,
      emailToken,
    ]);

    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: credentials.email,
      subject: "Verify your email...",
      html: `<h1><b>Hello ${credentials.fullname.split(' ')[0]} 👋,</b></h1>
                <p>Verify your email by clicking the button below,<br>
                Then log in using your email and password you set</p>
                <a href='${req.protocol}://${req.get("host")}/api/user/verify-email?emailToken=${emailToken}' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;'>Verify Your Email</a>
                <p>This link will remain valid for 1 day. If you have not verified your email address by then, you will have to create another account.</p>
                `,
    };

    await sendMail(options);

    // send a successful message to the client sde
    return res.status(200).json({
      status: true,
      message: "Account created successfully",
    });
  } catch (err) {
    if (err.errno === 1062 && err.sqlMessage.includes("email")) {
      if(checkUser[0].isVerified === true){
        return next(new ErrorResponse("hello error", 401));
      } else{
        //direct user to resend verification email
        return res.status(200).json({
          status: true,
          message: "Email already in use, verify your email...",
        });
      }
    } else {
    // handle errors using sql error message
    return next(err);
    }
  }
};

const verifyUserEmail = async (req, res, next) => {
  try {
    // create connection to database
    const connection = await connectDB();

    // get credentials entered during login
    const emailToken = req.query.emailToken;

    console.log(emailToken);

    // run a query to confirm the email enetered exists in the database
    const checkToken = await runQuery(connection, checkEmailToken, [
      emailToken,
    ]);

    console.log(checkToken);

    if (!emailToken) {
      return next(new ErrorResponse("EmailToken not found....", 404));
    }

    // check that the emailToken in the req is the same as the on in the database
    if (
      !checkToken ||
      checkToken.length === 0 ||
      checkToken[0].emailToken !== emailToken
    ) {
      return next(
        new ErrorResponse("Email Verification Failed, invalid token", 401)
      );
    }

    // checkToken.emailToken = null;
    isVerified = true;

    const updateVerification = await runQuery(connection, updateVerify, [
      isVerified,
      emailToken,
    ]);

    // send a successful login message to the client side
    res.status(200).json({
      status: true,
      message: "Email Verification successful, Proceed to login",
      isVerified: true,
    });
  } catch (err) {
    // handle error using the inbult error details
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
    const checkUser = await runQuery(connection, checkEmailLogin, [
      credentials.email,
    ]);

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

const resendVerification = async (req, res, next) => {
  try {
    // since the user won't input it again, the frontend would have to send it
    const { email } = req.body;

    // create a connection, await is used beacuse it is a promise
    const connection = await connectDB();

    // create a new emailToken using the hash() method
    const newEmailToken = hash();

    const checkEmail = await runQuery(connection, checkEmailLogin, [email])

    if(!checkEmail){
      return next(new ErrorResponse("Invalid Email", 401))
    }

    // use the function created for running a query to insert the credentials gotten from the request into the database
    const result = await runQuery(connection, updateEmailToken, [
      newEmailToken,
      email,
    ]);


    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: email,
      subject: "Verify your email...",
      html: `<h1><b>Hello ${checkEmail[0].fullname.split(' ')[0]} 👋,</b></h1>
                <p>Verify your email by clicking the button below,<br>
                Then log in using your email and password you set</p>
                <a href='https://rapidclean-laundry.onrender.com/api/user/verify-email?emailToken=${newEmailToken}' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;'>Verify Your Email</a>
                <p>This link will remain valid for 1 day. If you have not verified your email address by then, you will have to create another account.</p>
                `,
    };

    await sendMail(options);

    // send a successful message to the client sde
    return res.status(200).json({
      status: true,
      message: "Email Resent",
    });
  } catch (err) {
    // handle errors using sql error message
    return next(err);
    // console.log(err)
  }
};

module.exports = { login, signup, verifyUserEmail, resendVerification };


// notifications stored in the database