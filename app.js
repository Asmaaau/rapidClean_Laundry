// import packages
const express = require('express');
const cors = require('cors')
const config = require('dotenv');
const bodyParser = require('body-parser');
const {connectDB} = require('./database/db.config');
const {createTables, dropped} = require('./database/runQueries')
const errorHandler = require('./middlewares/errorHandler');

// impport routes
const auth = require('./routes/auth.routes')
const admin = require('./routes/admin.routes')
const product =require('./routes/product.routes')
const orders =require('./routes/orders.routes')
const users =require('./routes/customers.routes')


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

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// app.use(cors({origin: '*'}))


// app.use(
    // cors({origin:${req.get(“host”)}})
//   );

// middleware

app.use(cors())     //should be the first middleware

// app.options('*', cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/api/auth', auth)
app.use('/api/admin', admin)
app.use('/api/product', product)
app.use('/api/orders', orders)
app.use('/api/users', users)


app.use(errorHandler)   //should be the last middleware


const port = process.env.PORT || 5001;


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
    console.log("Tables created successfully");
}).catch((err) => {
    console.error("Error creating tables:", err);
    process.exit(1);
}); 

// dropped()

// const crypto = require("crypto");

// const hash = () => {

//     const num = crypto.randomBytes(64).toString("hex");
//     const number = parseInt(num)

//     return number;
// }

// console.log(hash()); 