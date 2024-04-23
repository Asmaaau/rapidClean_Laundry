const { connectDB, runQuery } = require('../database/db.config')
const {pushServices} = require('../database/products.sqlcommand')
const { generateShorterID } = require('../helper/authentication')

exports.insertServices = async(req, res, next) => {
     try {
          const connection = await connectDB();

          const { service_type, prod_id, price } = req.body;

          const setServices = await runQuery(connection, pushServices, [prod_id, service_type, price])

          res.status(200).json({
               status: true,
               message: `Service type - '${service_type}' added successfully`
          })
     }
     catch (err){
          return next(err)
     }
}