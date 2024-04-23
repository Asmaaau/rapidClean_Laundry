const { connectDB, runQuery } = require("../database/db.config");
const { generateCustomID } = require("../helper/authentication");
const ErrorResponse = require("../helper/errorResponse");
const {
  addOrder,
  addOrderDetails,
  calculateCost,
  getService,
  getAnOrder,
} = require("../database/orders.sqlcommand");
const { connect } = require("../routes/admin.routes");

const calculateTotalCost = async (services, selectedServiceID, quantity) => {
  const service = services.find((s) => s.service_id === selectedServiceID);

  if (!service) {
    throw new Error("Service type not found");
  }

  const totalCost = service.price * quantity;
  return totalCost;
};

const customerOrder = async (req, res, next) => {
  try {
    const connection = await connectDB();

    const order_id = generateCustomID();

    const cus_id = req.user.cus_id;
    console.log(cus_id);

    // deconstructing
    const { prod_id, service_id, quantity } = req.body;

    if (!prod_id || !service_id || !quantity)
      return next(new ErrorResponse("Select Details", 400));

    const makeOrder = await runQuery(connection, addOrder, [order_id, cus_id]);
    const getDetails = await runQuery(connection, addOrderDetails, [
      order_id,
      prod_id,
      service_id,
      quantity,
    ]);

    console.log(typeof service_id);

    const services = await runQuery(connection, getService, [prod_id]);
    console.log(typeof services[0].service_id);
    console.log(services);

    const total_sum = await calculateTotalCost(
      services,
      parseInt(service_id),
      quantity
    );

    const pushCost = await runQuery(connection, calculateCost, [
      total_sum,
      order_id,
    ]);

    res.status(201).json({
      status: true,
      message: "Oder created",
    });
  } catch (err) {
    return next(err);
  }
};

const showCusOrder = async (req, res, next) => {
  try {
    const connection = await connectDB();

   const order_id = req.params.id;

   if (!order_id) return next(new ErrorResponse("Create an Order to get Order Details", 400))

   const showAnOrder = await runQuery(connection, getAnOrder, [ order_id ] )

   return res.status(200).json({
     status: true,
     message: "Customer Order retrieved",
     data: showAnOrder
   })
  } catch (err) {
    return next(err);
  }
};

// get all orders

// get one custmer order

module.exports = { customerOrder, showCusOrder };
