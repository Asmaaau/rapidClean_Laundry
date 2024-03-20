const {connectDB} = require('./db.config')
const {createUserTable} = require('./sqlcommands')



const createTables = async(req, res)=>{
     const connection = await connectDB()

     connection.query(createUserTable, (err, result)=>{
         if(err){
          console.log(err)
          // res.status(501).json({message: err})
         } else {
          console.log(result)
          // res.status(200).json({message: result})
         }
     })
}

module.exports = {createTables}
