const mysql = require('mysql2');
const createUserTable = require('./sqlcommands')

// const connect = mysql.createPool({
//     connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT),
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     database: process.env.DB_NAME
// })

const connect = mysql.createPool({
    connectionLimit: 10,
    host: "b4trtxlsvptabfoori7i-mysql.services.clever-cloud.com",
    user: "usyapkvtfaqz4epu",
    password: "7q3ShvKcld98xaE1n4p7",
    database: "b4trtxlsvptabfoori7i"
})


const connectDB = async(req, res) => {
    return new Promise((resolve, reject) => {
        connect.getConnection((err, connection)=> {
            if(err) {
                reject(err)
            } 
            else{
                // connection.query(createUserTable)
                resolve(connection)
            }
        })
    })
}


// const connectDB = async(req, res) => {
   
//         connect.getConnection((err, connection)=> {
//             if(err) {
//                 console.log(err)
//             } 
//             else{
//                 console.log("databse connection successful")
//             }
//         })
// }

const runQuery = (connection, sql_command, values) => {
    return new Promise((resolve, reject)=> {
        connection.query(sql_command, values, (err, result)=> {
            connection.release();
            if(err){
                reject(err)
            }
            else{
                resolve(result)
            }
        })
    })
}

module.exports = {connectDB, runQuery}