const bcrypt = require("bcryptjs");
const { connectDB, runQuery } = require("../database/db.config");
const { checkEmailLogin, updateLogin } = require("../database/customers.sqlcommand");
const { authpassword, hash } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");
const {generateOTP} =  require("../helper/authentication")
const {sendMail} =  require("../utils/sendMail")


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

    if(!credentials.userpassword){
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

    const otp = generateOTP();

    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: credentials.email,
      subject: "Password Reset Request...",
      html: `<h1><b>Hello ${checkEmail[0].fullname} 👋,</b></h1>
                <p>Use the OTP below to reset your Rapid Clean password: </p>
               <h2><b>${otp}</b></h2>
                <p>This OTP will remain valid for 10 minutes. If you have not verified your email address by then, you will have to resend the request.</p>
                `,
    };

    await sendMail(options);

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
