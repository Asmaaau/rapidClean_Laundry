const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDB, runQuery } = require('../database/db.config')
const { checkEmailLogin } = require('../database/sqlcommands');

const login = async (req, res) => {

     const credentials = {
          email: req.body.email,
          userpassword: req.body.userpassword
     }

     const secretKey = process.env.JWT_SECRET;

     try {
          const connection = await connectDB();
          const checkEmail = await runQuery(connection, checkEmailLogin, [credentials.email])

          if (checkEmail.length === 0) {
               return res.status(200).json({ message: "Account does not exist. Signup" });
          }

          const hashedPassword = checkEmail[0].userpassword;

          const checkPwd = await bcrypt.compare(credentials.userpassword, hashedPassword)

          if (checkPwd) {
               const token = jwt.sign({ userid: checkEmail[0].userid, email: credentials.email }, secretKey, {
                    expiresIn: process.env.JWT_EXPIRES_IN
               })
               console.log(token)
               res.status(200).json({ message: "Login successful", token })
               console.log("Login successful")
          }
          else {
               console.log("Wrong Password");
               res.status(200).json({ message: "Wrong Password" })
          }
     }
     catch (err) {
          console.error("Error during login:", err);
          return res.status(500).json({ message: "Internal Server Error" });
     }
}

module.exports = { login }