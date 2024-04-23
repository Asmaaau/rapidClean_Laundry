const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const OTP = require("otp-generator");

exports.hash = () => crypto.randomBytes(64).toString("hex");

// console.log(hash());

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
  const shortUUID = uuid.replace(/-/g, "").substring(0, 10);
  return shortUUID;
};

exports.generateOTP = () => {
  const otp = OTP.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

exports.generateNumID = () => {
  const otp = OTP.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const addPrefix = `RC-${otp}`;
  return addPrefix;
};

exports.generateSpecialId = () => {
  const uuid = uuidv4();

  // Extract the first 10 characters of the UUID
  const shortUUID = uuid.substring(0, 4);

  const addName = `RC-${shortUUID}`;
  return addName;
};

// Function to generate a random number of a specified length
function generateRandomNumber(length) {
  let result = "";
  const characters = "0123456789"; // only digits
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// Function to generate the custom ID with the specified format
exports.generateCustomID = () => {
  const prefix = "RCA1"; // the prefix part of the ID
  const firstSegment = generateRandomNumber(5); // first 5-digit sequence
  const secondSegment = generateRandomNumber(5); // second 5-digit sequence

  const customID = `${prefix}-${firstSegment}-${secondSegment}`; // concatenating the parts
  return customID;
}

// const newID = generateCustomID();
// console.log(newID);

// exports.generateId = (customerNumber) => {
//   // Pad the customer number with leading zeros
//   const paddedCustomerNumber = String(customerNumber).padStart(4, '0');

//   const addPrefix = `CA-${paddedCustomerNumber}`

//   return addPrefix;
// };

// console.log(generateId(78));
