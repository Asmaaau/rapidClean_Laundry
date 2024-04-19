const mysql = require('mysql2');
const createUserTable = require('./sqlcommands');
require('dotenv').config()

// const connect = mysql.createPool({
//     connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT),
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     database: process.env.DB_NAME
// })

// console.log(process.env.DB_HOST)
// console.log(typeof process.env.DB_HOST)

const connect = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "heavenfreak11",
    database: "rapid_clean"
})


// const connect = mysql.createPool({
//     connectionLimit: 10,
//     host: "b4trtxlsvptabfoori7i-mysql.services.clever-cloud.com",
//     user: "usyapkvtfaqz4epu",
//     password: "7q3ShvKcld98xaE1n4p7",
//     database: "b4trtxlsvptabfoori7i"
// })


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

const runQuery = async(connection, sql_command, values) => {
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