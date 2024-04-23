const { pushCategory, getAllCat, getCatByID } = require("../database/category.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");
const ErrorResponse = require("../helper/errorResponse");

const addCategory = async (req, res, next) => {
  try {
    const connection = await connectDB();

    const cat_type = req.body.cat_type;

    const makeCategory = await runQuery(connection, pushCategory, [
     cat_type
    ]);

    res.status(201).json({
      status: true,
      message: "Category has been created",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllCategories = async (req, res, next) => {
try {
  const connection = await connectDB();
  
  connection.query(getAllCat, (err, result) => {
    connection.release();

    if (err) {
      console.log(err)
      return next(new ErrorResponse("Cannot Get Category", 404))
    }
    else {
      return res.status(200).json({
        status: true,
        data: result,
        message: "Catgory fetched"
      })
    }
  })
} catch(err){
  return next(err)
}
};

const getACategory = async (req, res, next) => {
  try {

    //  Retrieve customer ID from request parameters
    // console.log(req.params);
    const cat_id = req.params.id

    const connection = await connectDB();

    if (!cat_id) {
      return next(new ErrorResponse("Input an ID...", 401))
    }

    const getACategory = await runQuery(connection, getCatByID, [cat_id])

    if (getACategory.length === 0) {
      return next(new ErrorResponse(`Category with id: ${cat_id} does not exist`, 404))
    }

    res.status(200).json({
      status: true,
      data: getACategory[0],
      message: `Category with id: ${cat_id} retrieved succesfully`
    })
  }
  catch (err) {
    return next(err)
  }
}


exports.updateACategory = async (req, res, next) => {

}


exports.deleteCategory = async (req, res, next) => {

}


exports.deleteAllCategory = async (req, res, next) => {

}

module.exports = { getACategory, getAllCategories, addCategory}
