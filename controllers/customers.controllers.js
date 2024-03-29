const { getCusByID, getAllCustomer } = require("../database/customers.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");
const { generateShorterID } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");

exports.getCustomerID = async(req, res, next) => {
     try {

     //  Retrieve customer ID from request parameters
       const { cus_id } = req.params

       const connection = await connectDB();

       if(!cus_id){
          return next(new ErrorResponse("Input an ID...", 401))
       }

       const getAcustomer = await runQuery(connection, getCusByID, [ cus_id ])

       if(getAcustomer.length === 0){
          return next(new ErrorResponse(`Customer with id: ${cus_id} does not exist`, 404))
       }

       console.log(`Customer with id: ${cus_id} retrieved succesfully`);

       return res.status(200).json({
          status:true,
          data: getAcustomer[0],
          message: `Customer with id: ${cus_id} retrieved succesfully`
       })
     }
     catch(err){
          return next(err)
     }
}