const { pushProduct } = require('../database/sqlcommands')
const { connectDB, runQuery } = require('../database/db.config')
const {generateShorterID} = require('../helper/authentication');


exports.insertProduct = async(req, res, next) => {

     try {
     
     const connection = await connectDB();

     const prod_id = generateShorterID();

     // make the prod_type unique
     

// deconstructing
     const { prod_type, icon_url } = req.body
          // prod_id,
          // prod_type: req.body.prod_type,
          // icon_url: req.body.icon_url

     // const makeProduct = await runQuery(connection, pushProduct, [products.prod_id, products.prod_type, products.icon_url])
     const makeProduct = await runQuery(connection, pushProduct, [prod_id, prod_type, icon_url])

     res.status(201).json({
          status: true,
          message: "Product has been added to the list"
      })
     }
     catch(err) {
          return next(err);
     }
     
}

// create routes and logic for:-

// get a product (by id), delete a product and update a product...check online
// get all products
// Same thing for services, extra and order, oderDetails
// create an admin routes for signup, login and resetPassword, update information
// create admin auth
// learn nodemailer and brevo