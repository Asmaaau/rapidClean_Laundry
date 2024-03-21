const bcrypt = require('bcryptjs');
const { connectDB, runQuery } = require('../database/db.config')
const { checkEmailLogin, updateLogin } = require('../database/sqlcommands');
const bcSaltRounds = bcrypt.genSaltSync(10)


const resetPasssword = async (req, res) => {
     const credentials = {
          email: req.body.email,
          userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds)
     }
     const connection = await connectDB();


     try {
          const checkEmail = await runQuery(connection, checkEmailLogin, [credentials.email]);
          if(checkEmail.length > 0) {
               const updatePWD = await runQuery(connection, updateLogin, [credentials.userpassword, credentials.email])
               return res.status(200).json({message: "Password has been reset successfully. Back to Login"})

          } else {
               return res.status(200).json({ message: "Account does not exist. Signup" });
          }
     }
     catch (err) {
          console.error("Error during reset:", err);
          return res.status(500).json({ message: "Password could not be reset. Try again" });
     }


}

module.exports = { resetPasssword }