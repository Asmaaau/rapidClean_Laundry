// import packages
const express = require('express');
const cors = require('cors')
const config = require('dotenv');
const bodyParser = require('body-parser');
const {connectDB} = require('./database/db.config')

// impport routes


config.config({path: "config/config.env"})


// create express object
const app = express()


// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// start express server

const port = process.env.PORT || 4001
app.listen(port, ()=> {
    console.log(`server running on port ${port}`)
})



// connect to database

connectDB().then(()=>{
    console.log("databse connection successful")
}).catch(err=>{
    console.log(err)
})