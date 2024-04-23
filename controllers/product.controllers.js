const { pushProduct, getAllProds, getProdByID, productByCat, updateProduct, deleteProduct, deleteProductandServices, priceList } = require("../database/products.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");
const { generateShorterID, generateSpecialId, generateNumID } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");

exports.insertProduct = async (req, res, next) => {
  try {
    const connection = await connectDB();

    const prod_id = generateNumID();

    // make the prod_type unique

    // deconstructing
    const { prod_type, cat_id, icon_url } = req.body;

    const makeProduct = await runQuery(connection, pushProduct, [
      prod_id,
      prod_type,
      icon_url,
      cat_id
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
  console.log(req.query);
  connection.query(getAllProds, (err, result) => {
    connection.release();

    if (err) {
      console.log(err)
      return next(new ErrorResponse("Cannot Get Product", 400))
    }
    else {
      return res.status(200).json({
        status: true,
        data: result
      })
    }
  })
};
// exports.getAllProducts = async (req, res, next) => {
//   const connection = await connectDB();
//   console.log(req.query);
//   connection.query(getAllProds, (err, result) => {
//     connection.release();

//     if (err) {
//       console.log(err)
//       return next(new ErrorResponse("Cannot Get Product", 400))
//     }
//     else {
//       return res.status(200).json({
//         status: true,
//         data: result
//       })
//     }
//   })
// };

exports.getAProduct = async (req, res, next) => {
  try {

    //  Retrieve customer ID from request parameters
    // console.log(req.params);
    const prod_id = req.params.id

    const connection = await connectDB();

    if (!prod_id) {
      return next(new ErrorResponse("Select a product...", 401))
    }

    const getAProduct = await runQuery(connection, getProdByID, [prod_id])

    if (getAProduct.length === 0) {
      return next(new ErrorResponse(`Product with id: ${prod_id} does not exist`, 400))
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

exports.getProductByCategory = async (req, res, next) => {
  try {
    const cat_id = req.query.id

    const connection = await connectDB();
    console.log(req.query);

    if (!cat_id) {40
      return next(new ErrorResponse("Select a category...", 400))
    }

    const getProducts = await runQuery(connection, productByCat, [cat_id])

    if (getProducts.length === 0) {
      return next(new ErrorResponse(`No Products in category ${cat_id} yet`, 400))

    }

    return res.status(200).json({
      status: true,
      data: getProducts
    })

  } catch (err) {
    console.log(err);
    return next(err)
    
  }

}

exports.updateAProduct = async (req, res, next) => {
  try {

    const { prod_type, price, cat_id } = req.body
    const prod_id = req.params.id

    if (!prod_type || !price || !cat_id) {
      return next(new ErrorResponse("Select at least one field to update", 401))
    }

    // create connection to database
    const connection = await connectDB();

    // update product using query
    const updateAProduct = await runQuery(connection, updateProduct, [
      prod_type,
      price,
      prod_id
    ]);

    // send successful updated message to client side
    return res
      .status(200)
      .json({
        status: true,
        message: "Product has been updated"
      });
  } catch (err) {

    // handle error
    console.error("Error during update:", err);
    return next(err);
  }
};

// exports.deleteProduct = async (req, res, next) => {
//   try {

//     const prod_id = req.params.id

//     if (!prod_id) {
//       return next(new ErrorResponse("Select Product to delete", 401))
//     }

//     // create connection to database
//     const connection = await connectDB();

//     // delete product using query
//     const deleteAProduct = await runQuery(connection, deleteProduct, [
//       prod_id
//     ]);

//     // send successful deleted message to client side
//     return res
//       .status(200)
//       .json({
//         status: true,
//         message: "Product has been deleted"
//       });
//   } catch (err) {

//     // handle error
//     console.error("Error during deletion:", err);
//     return next(err);
//   }
// };


exports.deleteProduct = async (req, res, next) => {
  try {

    const prod_id = req.params.id

    if (!prod_id) {
      return next(new ErrorResponse("Select Product to delete", 401))
    }

    // create connection to database
    const connection = await connectDB();

    // delete product using query
    const deleteAProduct = await runQuery(connection, deleteProductandServices, [
      prod_id
    ]);

    // send successful deleted message to client side
    return res
      .status(200)
      .json({
        status: true,
        message: "Product has been deleted"
      });
  } catch (err) {

    // handle error
    console.error("Error during deletion:", err);
    return next(err);
  }
};


exports.deleteAllProducts = async (req, res, next) => {

}

exports.setPriceList = async (req, res, next) => {
  try{
    const connection = await connectDB();

      connection.query(priceList, (err, result) => {
        connection.release();
    
        if (err) {
          console.log(err)
          return next(new ErrorResponse("Cannot Get List", 400))
        }
        else {
          return res.status(200).json({
            status: true,
            data: result
          })
        }
      })
  } catch(err) {
    console.log(err);
    return next(err)
  }
}


// create routes and logic for:-

// get a product (by id), delete a product and update a product...check online
// get all products
// Same thing for services, extra and order, oderDetails
// create an admin routes for signup, login and resetPassword, update information
// create admin auth
// learn nodemailer and brevo
