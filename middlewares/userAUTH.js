const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helper/errorResponse");
const { geCusByID } = require("../database/customers.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");

const verifyAuth = async (req, res, next) => {
  try {
    const connection = await connectDB();

    let checkUserId;

    const bearer = req.headers["authorization"];

    const auth = req.headers["auth"];
    console.log(req.headers);

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
    if (auth && auth == "admin-auth") {
      //get user by id for admin
      checkUserId = await runQuery(connection, sqlcommandforadmin, [
        decoded.userid,
      ]);
    } else {
      //get user by id
      checkUserId = await runQuery(connection, geCusByID, [decoded.userid]);
    }

    //     console.log(checkUserId);

    if (checkUserId.length === 0) {
      return next(new ErrorResponse("Unauthorized user", 401));
    }

    

    // add req.user

    req.user = checkUserId[0];

    // console.log(req.decoded);
    // console.log(bearer);
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { verifyAuth };
