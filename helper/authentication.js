const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const OTP = require('otp-generator')

exports.hash = () => crypto.randomBytes(64).toString("hex");

exports.authpassword = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.JWT_SECRET)
    .digest("hex");
};


exports.genToken = (userid) =>
  jwt.sign({ userid: userid }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });


  exports.generateShorterID = () => {
    const uuid = uuidv4();
    
    // Extract the first 10 characters of the UUID
    const shortUUID = uuid.replace(/-/g, '').substring(0, 10);
    return shortUUID;
}

exports.generateOTP = () => {
  const otp = OTP.generate(6, { 
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
   });

   return otp;
}

