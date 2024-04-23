const { connectDB, runQuery } = require("../database/db.config");
const { generateCustomID } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");
const { addOrder, addOrderDetails} = require('../database/orders.sqlcommand')


function calculateTotalCost(services, selectedServiceType, quantity) {
     const service = services.find(s => s.service_type_name === selectedServiceType);

     if (!service) {
          throw new Error('Service type not found');
     }

     const totalCost = service.price * quantity;
     return totalCost;
}

const customerOrder = async (req, res, next) => {

     try {
          const connection = await connectDB();

          const order_id = generateCustomID();

          const cus_id = req.user.cus_id;
          console.log(cus_id)

          // deconstructing
          const { prod_id, service_id, quantity } = req.body;

          if (!prod_id || !service_id || !quantity ) return next(new ErrorResponse("Select Details", 400))

          const makeOrder = await runQuery(connection, addOrder, [
               order_id,
               cus_id

          ]);
          const getDetails = await runQuery(connection, addOrderDetails, [
               order_id,
               service_id,
               quantity
          ]);

          res.status(201).json({
               status: true,
               message: "Oder created",
               data: makeOrder[0].order_id, getDetails
          });
     } catch (err) {
          return next(err);
     }
};


module.exports = {customerOrder}

