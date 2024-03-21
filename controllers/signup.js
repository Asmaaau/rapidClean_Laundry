const bcrypt = require('bcryptjs');
const { connectDB, runQuery } = require('../database/db.config')
const { insertSignup } = require('../database/sqlcommands');
const { v4: uuidv4 } = require('uuid');
const bcSaltRounds = bcrypt.genSaltSync(10)





const signup = async (req, res) => {

     const userid = uuidv4();
     const credentials = {
          userid: userid,
          fullname: req.body.fullname,
          email: req.body.email,
          userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds)
     }

     const connection = await connectDB();

     const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

     if (!validEmailRegex.test(credentials.email)) {
          return res.status(400).json({ message: "Invalid email format" });
     }

     if (credentials.userpassword.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
     }

     try {
          const result = await runQuery(connection, insertSignup, [credentials.userid, credentials.fullname, credentials.email, credentials.userpassword])
          if (result) {
               return res.status(200).json({ message: result })
          } else {
               if (credentials.fullname.trim() === 0 || credentials.email.trim() === 0 || credentials.userpassword.trim() === 0) {
                    return res.status(200).json({ message: "Cannot have empty fields!" })
               }
               else {
                    return res.status(500).json({ message: "Something went wrong!" })
               }
          }
     } catch (err) {
          if (err && err.errno === 1062) {
               return res.status(400).json({ message: "Email already exists" });
          }
          // Handle other errors
          console.error("Signup error:", err);
          res.status(500).json({ message: "Error!, For some reasons, your account could not be created." })
     }


}

module.exports = { signup }