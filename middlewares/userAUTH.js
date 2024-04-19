const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helper/errorResponse");
const { getCusByID } = require("../database/customers.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");

const verifyAuth = async (req, res, next) => {
  try {
    const connection = await connectDB();

    let checkUserId;

    const bearer = req.headers["authorization"];
    console.log(req.headers);

    const auth = req.headers["auth"];
    // console.log(req.headers);

    if (typeof bearer == "undefined") {
      return next(new ErrorResponse("Unauthorized user", 404));
    }

    const token = bearer.split(" ")[1];

    // req.webToken = fullbearer[1];
    // req.decoded = jwt.verify(fullbearer[1], process.env.JWT_SECRET)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    if (!decoded.userid) {
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    // recheck this code
    if (auth && auth == "admin-auth") {
      //get user by id for admin
      checkUserId = await runQuery(connection, sqlcommandforadmin, [
        decoded.userid,
      ]);
    } else {
      //get user by id
      checkUserId = await runQuery(connection, getCusByID, [decoded.userid]);
    }

    //     console.log(checkUserId);

    if (checkUserId.length === 0) {
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    // add req.user

    req.user = checkUserId[0];

    // console.log(req.user);

    // console.log(req.decoded);
    // console.log(bearer);
    next();
  } catch (err) {
    return next(err);
  }
};

const verifyAdminAuth = async (req, res, next) => {
  try {
    const connection = await connectDB();

    let checkUserId;

    const bearer = req.headers["authorization"];
    console.log(req);
    console.log(req.headers);

    const auth = req.headers["auth"];
    // console.log(req.headers);

    if (typeof bearer == "undefined") {
      return next(new ErrorResponse("Unauthorized user", 404));
    }

    const token = bearer.split(" ")[1];

    // req.webToken = fullbearer[1];
    // req.decoded = jwt.verify(fullbearer[1], process.env.JWT_SECRET)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userid) {
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    // recheck this code
    if (!auth || auth !== "admin-auth") {
      //get user by id for admin
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    // fix sql command query
    checkUserId = await runQuery(connection, sqlcommandforadmin, [
      decoded.userid,
    ]);
    //     console.log(checkUserId);

    if (checkUserId.length === 0) {
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    // add req.user

    req.admin = checkUserId[0];

    // console.log(req.decoded);
    // console.log(bearer);
    next();
  } catch (err) {
    return next(err);
  }
};

// console.log(verifyAdminAuth());
module.exports = { verifyAuth, verifyAdminAuth };
