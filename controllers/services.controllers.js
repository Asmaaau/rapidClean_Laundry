const { connectDB, runQuery } = require('../database/db.config')
const {pushServices} = require('../database/sqlcommands')
const { generateShorterID } = require('../helper/authentication')

exports.insertServices = async(req, res, next) => {
     try {
          const connection = await connectDB();

          const service_id = generateShorterID()

          const services = {
               service_id,
               service_type: req.body.service_type,
               price: req.body.price
          }

          const setServices = await runQuery(connection, pushServices, [services.service_id, services.service_type, services.price])

          res.status(200).json({
               status: true,
               message: "Service type added successfully"
          })
     }
     catch (err){
          return next(err)
     }
}

// TO DO
// 