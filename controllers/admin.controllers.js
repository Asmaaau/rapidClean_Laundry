const { v4: uuidv4 } = require("uuid");
const { connectDB, runQuery } = require("../database/db.config");
const { insertAdminSignup, AdminEmailLogin, updatAdminVerify, AdminEmailToken, updateAdminEmailToken, updateAdminLogin } = require("../database/admin.sqlcommand");
const ErrorResponse = require("../helper/errorResponse");
const { authpassword, hash, genToken, generateOTP } = require("../helper/authentication");
const { sendMail } = require("../utils/sendMail");

const Adminsignup = async (req, res, next) => {

     // create a salt using the hash function created in the helper file
     const salt = hash();

     let checkUser;

     try {
          // get the users credential from the request
          const { fullname, email, userpassword } = req.body


          // create a connection, await is used beacuse it is a promise
          const connection = await connectDB();

          // create a variable that holds regex form of an email
          const validEmailRegex =
               /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

          // check that the email entered corresponds with the regex format set
          if (!validEmailRegex.test(email)) {
               return next(new ErrorResponse("Invalid email format", 400));
          }

          // check that the password entered meets the requirements
          if (
               !(
                    userpassword.length >= 8 &&
                    /[A-Z]/.test(userpassword) &&
                    /[a-z]/.test(userpassword) &&
                    /[0-9]/.test(userpassword)
               )
          ) {
               return next(
                    new ErrorResponse("Password does not meet the requirements", 401)
               );
          }

          // hash the password entered using the function created to hash
          userpassword = authpassword(salt, req.body.userpassword);


          // run a query to check if the email enetered already exists in the database but isVerified is false  
          checkUser = await runQuery(connection, AdminEmailLogin, [
               email,
          ]);

          // create the emailToken using the hash() method
          const emailToken = hash();

          // use the function created for running a query to insert the credentials gotten from the request into the database
          const result = await runQuery(connection, insertAdminSignup, [
               fullname,
               email,
               userpassword,
               salt,
               emailToken,
          ]);

          // const verificationLink = `${req.protocol}://${req.get("host")}/api/user/verify-email?emailToken=${emailToken}&redirect=/login`

          const options = {
               // from: "kharchiee@outlook.com",
               from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
               to: email,
               subject: "Verify your email...",
               html: `<h1><b>Hello ${fullname.split(' ')[0]} 👋,</b></h1>
                <p>Verify your email by clicking the button below,<br>
                Then log in using your email and password you set</p>
                <a href='http://localhost:5173/Login?emailToken=${emailToken}' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;'>Verify Your Email</a>
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

const verifyAdminEmail = async (req, res, next) => {
     try {
          // create connection to database
          const connection = await connectDB();

          // get credentials entered during login
          const emailToken = req.query.emailToken;

          console.log(emailToken);

          // run a query to confirm the email enetered exists in the database
          const checkToken = await runQuery(connection, AdminEmailToken, [
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

          const updateVerification = await runQuery(connection, updatAdminVerify, [
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

const Adminlogin = async (req, res, next) => {
     // get credentials entered during login
     const { email, userpassword } = req.body

     try {
          // create connection to database
          const connection = await connectDB();

          // run a query to confirm the email enetered exists in the database
          const checkUser = await runQuery(connection, AdminEmailLogin, [
               email,
          ]);

          // handle the case of an empty result from the query
          if (checkUser.length === 0) {
               return next(new ErrorResponse("Account does not exist. Signup", 409));
          }

          // retrieve the salt stored in the database
          const salt = checkUser[0].salt;

          // hash the password entered during login using the salt retrieved from database
          const hashedPassword = authpassword(salt, userpassword);

          console.log(checkUser[0].userpassword);
          console.log(hashedPassword);

          // check that the hashed password in the previuos line of code is identical to the one stored in the database
          if (checkUser[0].userpassword != hashedPassword) {
               return next(new ErrorResponse("Wrong Password", 401));
          }

          // generate a token for the user using the genToken function created in the helper file
          const AdminAuthToken = genToken(checkUser[0].cus_id);

          // send a successful login message to the client side
          res
               .status(200)
               .json({ status: true, message: "Login successful", AdminAuthToken });
     } catch (err) {
          // handle error using the inbult error details
          return next(err);
     }
};

const resendAdminVerification = async (req, res, next) => {
     try {
          // since the user won't input it again, the frontend would have to send it
          const email = req.body;

          // create a connection, await is used beacuse it is a promise
          const connection = await connectDB();

          // create a new emailToken using the hash() method
          const newEmailToken = hash();

          const checkEmail = await runQuery(connection, AdminEmailLogin, [email])

          if (!checkEmail) {
               return next(new ErrorResponse("Invalid Email", 401))
          }

          // use the function created for running a query to insert the credentials gotten from the request into the database
          const result = await runQuery(connection, updateAdminEmailToken, [
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

const AdminforgotPassword = async (req, res, next) => {
     try {
          const email = req.body

          const connection = await connectDB();

          // run query to check that email exists in database
          const checkEmail = await runQuery(connection, AdminEmailLogin, [
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
     catch (err) {
          return next(err)
     }
}

const AdminResetPasssword = async (req, res, next) => {
     try {
          // get credentials
          const { email, userpassword } = req.body

          // generate a salt value using the hash function
          const salt = hash();


          // handle no password inputed
          if (!userpassword) {
               return next(new ErrorResponse("Input a new password", 401))
          }


          //hash the new password
          userpassword = authpassword(salt, req.body.userpassword);

          // create connection to database
          const connection = await connectDB();

          // run query to check that email exists in database
          const checkEmail = await runQuery(connection, AdminEmailLogin, [
               email,
          ]);

          // handle false result
          if (checkEmail.length === 0) {
               return next(new ErrorResponse("Account does not exist. Signup", 401));
          }

          // update password and salt using query
          const updatePWD = await runQuery(connection, updateAdminLogin, [
               userpassword,
               salt,
               email,
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

module.exports = {
     Adminlogin,
     Adminsignup,
     verifyAdminEmail,
     resendAdminVerification,
     AdminforgotPassword,
     AdminResetPasssword
};


// notifications stored in the database
// update customer status, order status