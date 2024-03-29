const { pushProduct, getAllProds, getProdByID } = require("../database/products.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");
const { generateShorterID } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");

exports.insertProduct = async (req, res, next) => {
  try {
    const connection = await connectDB();

    const prod_id = generateShorterID();

    // make the prod_type unique

    // deconstructing
    const { prod_type, icon_url } = req.body;
    // prod_id,
    // prod_type: req.body.prod_type,
    // icon_url: req.body.icon_url

    // const makeProduct = await runQuery(connection, pushProduct, [products.prod_id, products.prod_type, products.icon_url])
    const makeProduct = await runQuery(connection, pushProduct, [
      prod_id,
      prod_type,
      icon_url,
    ]);

    res.status(201).json({
      status: true,
      message: "Product has been added to the list",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  const connection = await connectDB();
  connection.query(getAllProds, (err, result) => {
    connection.release();

    if (err) {
      console.log(err)
      return next(new ErrorResponse("Cannot Get Product", 404))
    }
    else {
      return res.status(200).json({
        status: true,
        data: result
      })
    }
  })
};

exports.getAProduct = async (req, res, next) => {
  try {

    //  Retrieve customer ID from request parameters
    // console.log(req.params);
    const prod_id = req.params.id

    const connection = await connectDB();

    if (!prod_id) {
      return next(new ErrorResponse("Input an ID...", 401))
    }

    const getAProduct = await runQuery(connection, getProdByID, [prod_id])

    if (getAProduct.length === 0) {
      return next(new ErrorResponse(`Product with id: ${prod_id} does not exist`, 404))
    }

    res.status(200).json({
      status: true,
      data: getAProduct[0],
      message: `Product with id: ${prod_id} retrieved succesfully`
    })
  }
  catch (err) {
    return next(err)
  }
}


exports.updateAProduct = async (req, res, next) => {

}


// create routes and logic for:-

// get a product (by id), delete a product and update a product...check online
// get all products
// Same thing for services, extra and order, oderDetails
// create an admin routes for signup, login and resetPassword, update information
// create admin auth
// learn nodemailer and brevo
