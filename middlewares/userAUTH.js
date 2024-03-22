const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helper/errorResponse");
const { getUserByID } = require("../database/sqlcommands");
const { connectDB, runQuery } = require("../database/db.config");

const verifyAuth = async (req, res, next) => {
  try {
    const connection = await connectDB();

    const bearer = req.headers["authorization"];

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

    //     get user by id
    const checkUserId = await runQuery(connection, getUserByID, [
      decoded.userid,
    ]);

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
