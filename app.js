// import packages
const express = require('express');
const cors = require('cors')
const config = require('dotenv');
const bodyParser = require('body-parser');
const {connectDB} = require('./database/db.config');
const {createTables, dropped} = require('./database/runQueries')
const errorHandler = require('./middlewares/errorHandler')


// impport routes
const {router} = require('./routes/routes')


config.config({path: "./config/config.env"})


// create express object
const app = express()


// middleware
app.use(cors())     //should be the first middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/', router)


app.use(errorHandler)   //should be the last middleware

// start express server

const port = process.env.PORT || 4001
app.listen(port, ()=> {
    console.log(`server running on port ${port}`)
})



// connect to database

// connectDB().then(()=>{
//     console.log("Databse connection successful")
// }).catch(err=>{
//     console.log(err)
// })

// createTables()
// it keeps running regardless

// app.use('/', createTables)

// createTables()

// createTables().then(() => {
//     // console.log("Tables created successfully");
// }).catch((err) => {
//     console.error("Error creating tables:", err);
//     process.exit(1);
// });

// dropped()