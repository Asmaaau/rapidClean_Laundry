const bcrypt = require("bcryptjs");
const { connectDB, runQuery } = require("../database/db.config");
const { checkEmailLogin, updateLogin } = require("../database/auth.sqlcommand");
const { authpassword, hash } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");
const {generateOTP} =  require("../helper/authentication")
const {sendMail} =  require("../utils/sendMail")


const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const connection = await connectDB();

         // run query to check that email exists in database
         const checkEmail = await runQuery(connection, checkEmailLogin, [
          email,
        ]);

             // handle false result
    if (checkEmail.length === 0) {
      return next(new ErrorResponse("Account does not exist. Signup", 401));
    }

    const otp = generateOTP();

    const options = {
      // from: "kharchiee@outlook.com",
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: email,
      subject: "Password Reset Request...",
      html: `<h1><b>Hello ${checkEmail[0].fullname.split(' ')[0]} 👋,</b></h1>
                <p>Need a new Paaword?</p>
                <p>No worries. Use the OTP below to reset your Rapid Clean account password: </p>
               <h2><b>${otp}</b></h2>
                <p>This OTP will remain valid for 10 minutes. If you did not request this change, ignore this email and get back to your already amazing day 😇.</p> <br><br>
                <a><b>Plot 255 Hassan T. Sanni Str. CBN Choos Estate, Apo Wumba</b></a>
                `,
    };

    await sendMail(options);

    return res
    .status(200)
    .json({ message: "Email sent" });

  }
  catch(err){
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

// const details = (req, res, next) => {
//   res.status(200).json({message: "Hello there"})
// }

module.exports = { resetPasssword, forgotPassword };
