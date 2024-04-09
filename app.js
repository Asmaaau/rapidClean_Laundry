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
// console.log(process.env);

// create express object
const app = express()

// const corsOptions ={
//     origin: '*', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// middleware

// make sure fix this later....temporary fix
// app.use(cors())     //should be the first middleware

// app.options('*', cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/api', router)


app.use(errorHandler)   //should be the last middleware


const port = process.env.PORT || 5001


// connect to database

connectDB().then(()=>{
    console.log("Databse connection successful")

    
// start express server
    app.listen(port, ()=> {
        console.log(`server running on port ${port}`)
    })
}).catch(err=>{
    console.log(err)
})



// createTables()
// it keeps running regardless

// app.use('/', createTables) 

// createTables()

createTables().then(() => {
    // console.log("Tables created successfully");
}).catch((err) => {
    console.error("Error creating tables:", err);
    process.exit(1);
}); 

// dropped()