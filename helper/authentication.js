const crypto = require("crypto");
const jwt = require("jsonwebtoken");
exports.hash = () => crypto.randomBytes(20).toString("hex");

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


