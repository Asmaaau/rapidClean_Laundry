const { v4: uuidv4 } = require("uuid");
const { connectDB, runQuery } = require("../database/db.config");
const { insertSignup, updateVerify, updateEmailToken, checkEmailToken, checkEmailLogin, updateLogin } = require("../database/auth.sqlcommand");
const ErrorResponse = require("../helper/errorResponse");
const { authpassword, hash, genToken, generateOTP } = require("../helper/authentication");
const { sendMail } = require("../utils/sendMail");
const fs = require('fs');
const path = require('path');

const readEmailTemplate = (templateName) => {
  const emailTemplatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
  return emailTemplate;
};

const signup = async (req, res, next) => {

  // create a salt using the hash function created in the helper file
  const salt = hash();

  let checkUser;

  try {
    // get the users credential from the request
    const credentials = {
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

    // create the emailToken using the hash() method
    const emailToken = hash();

    // use the function created for running a query to insert the credentials gotten from the request into the database
    const result = await runQuery(connection, insertSignup, [
      credentials.fullname,
      credentials.email,
      credentials.userpassword,
      salt,
      emailToken,
    ]);

    // const verificationLink = `${req.protocol}://${req.get("host")}/api/user/verify-email?emailToken=${emailToken}&redirect=/login`

    // Read the email template
    const emailTemplate = readEmailTemplate('verificationEmail');

    const firstName = credentials.fullname.split(' ')[0];
    const verificationLink = `http://localhost:5173/Login?emailToken=${emailToken}`;

    const emailContent = emailTemplate
      .replace('{{firstName}}', firstName)
      .replace('{{verificationLink}}', verificationLink);

    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: credentials.email,
      subject: "Verify your email...",
      html: emailContent,
    };

    await sendMail(options);

    // send a successful message to the client sde
    return res.status(200).json({
      status: true,
      message: "Account created successfully",
    });
  } catch (err) {
    if (err.errno === 1062 && err.sqlMessage.includes("email")) {
      if (checkUser[0].isVerified === true) {

        return;
      } else {
        return res.status(200).json({
          //direct user to resend verification email
          status: true,
          message: "Email already in use, verify your email...",
        });
      }
    }
    else {
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

    // console.log(checkUser[0].userpassword);
    // console.log(hashedPassword);

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

    if (!checkEmail) {
      return next(new ErrorResponse("Invalid Email", 401))
    }

    // use the function created for running a query to insert the credentials gotten from the request into the database
    const result = await runQuery(connection, updateEmailToken, [
      newEmailToken,
      email,
    ]);

    // Read the email template
    const emailTemplate = readEmailTemplate('verificationEmail');

    const firstName = credentials.fullname.split(' ')[0];
    const verificationLink = `http://localhost:5173/Login?emailToken=${emailToken}`;

    const emailContent = emailTemplate
      .replace('{{firstName}}', firstName)
      .replace('{{verificationLink}}', verificationLink);


    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: email,
      subject: "Verify your email...",
      html: emailContent,
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const connection = await connectDB();

    // run query to check that email exists in database
    const checkEmail = await runQuery(connection, checkEmailLogin, [
      email,
    ]);

    // create the emailToken using the hash() method
    const emailToken = hash();

    // handle false result
    if (checkEmail.length === 0) {
      return next(new ErrorResponse("Account does not exist. Signup", 401));
    }


    const result = await runQuery(connection, updateEmailToken, [
      email,
      emailToken,
    ]);
    // const otp = generateOTP();

    // Read the email template
    const emailTemplate = readEmailTemplate('resetPassword');

    const firstName = checkEmail[0].fullname.split(' ')[0];
    const verificationLink = `http://localhost:5173/Login?emailToken=${emailToken}`; // email verified proceed to login

    const emailContent = emailTemplate
      .replace('{{firstName}}', firstName)
      .replace('{{verificationLink}}', verificationLink);

    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: email,
      subject: "Password Reset Request...",
      html: emailContent,
    };

    await sendMail(options);

    return res
      .status(200)
      .json({ message: "Email sent" });

  }
  catch (err) {
    return next(err)
  }
}

const resetPasssword = async (req, res, next) => {
  try {
    // get credentials
    const credentials = {
      email: req.body.email,
      userpassword: req.body.userpassword,
    };

    // generate a salt value using the hash function
    const salt = hash();


    // handle no password inputed
    if (!credentials.userpassword) {
      return next(new ErrorResponse("Input a new password", 401))
    }


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

const changePassword = async (req, res, next) => {
  try {
    // get password
    const {current_password, userpassword } = req.body;

    if (!current_password || !userpassword ) return next(new ErrorResponse("Input password", 400))

    // generate a salt value using the hash function
    const salt = hash();


    //hash the new password
    userpassword = authpassword(salt, req.body.userpassword);

    // create connection to database
    const connection = await connectDB();

    const email = req.user.email

    // run query to check that current passsword is correct
    const checkEmail = await runQuery(connection, checkEmailLogin, [
      email
    ]);

    // handle false result
    if (checkEmail.userpassword !== current_password) {
      return next(new ErrorResponse("Incorrect Password", 401));
    }

    // update password and salt using query
    const updatePWD = await runQuery(connection, updateLogin, [
      userpassword,
      salt,
      email,
    ]);

    // send successful reset message to client side
    return res
      .status(200)
      .json({ message: "Password changed successfully." });
  } catch (err) {

    // handle error
    console.error("Error during change:", err);
    return next(err);
  }
}

module.exports = {
  login,
  signup,
  verifyUserEmail,
  resendVerification,
  forgotPassword,
  resetPasssword,
  changePassword,
};


// notifications stored in the database