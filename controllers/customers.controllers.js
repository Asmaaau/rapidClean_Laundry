const { getCusByID, getAllCustomer, saveNewSubs, subExist, updatePro } = require("../database/customers.sqlcommand");
const { connectDB, runQuery } = require("../database/db.config");
const ErrorResponse = require("../helper/errorResponse");
const { sendMail } = require("../utils/sendMail");
const fs = require('fs');
const path = require('path');

const loadTemplate = (templateName) => {
  const filePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  return fs.readFileSync(filePath, 'utf8');
};


const getCustomerID = async(req, res, next) => {
     try {

     //  Retrieve customer ID from request parameters
       const cus_id  = req.params.id

       const connection = await connectDB();

       if(!cus_id){
          return next(new ErrorResponse("Select a customer...", 401))
       }

       const getAcustomer = await runQuery(connection, getCusByID, [ cus_id ])

       if(getAcustomer.length === 0){
          return next(new ErrorResponse(`Customer with id: ${cus_id} does not exist`, 404))
       }

       console.log(`Customer with id: ${cus_id} retrieved succesfully`);

       return res.status(200).json({
          status:true,
          data: getAcustomer[0],
          message: `Customer with id: ${cus_id} retrieved succesfully`
       })
     }
     catch(err){
          return next(err)
     }
}

const getAllCustomers = async (req, res, next) => {
   const connection = await connectDB();

   console.log(req.user.email);
   req.user.fullname.split(' ')[0]
   connection.query(getAllCustomer, (err, result) => {
     connection.release();
 
     if (err) {
       console.log(err)
       return next(new ErrorResponse("Cannot Get Customers", 404))
     }
     else {
       return res.status(200).json({
         status: true,
         data: result
       })
     }
   })
 };

 const newsLetterSubs = async (req, res, next) => {

  try {
    const connection = await connectDB();

    const email = req.body.email;

    const checkEmail = await runQuery(connection, subExist, [email])

    if (checkEmail.length !== 0){

      const htmlContent = loadTemplate('existingSubscriber');
      // const htmlContent = loadTemplate('welcomeNewsLetter');
      const otheroptions = {
        from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
        to: email,
        subject: "You Are Already Subscribed to Rapid Clean Newsletter🎉",
        html: htmlContent
      };
  
      await sendMail(otheroptions);

      return res.status(201).json({
        status: true,
        message: "Subsciber Exists",
      });
    }

    const newsLetter = await runQuery(connection, saveNewSubs, [
     email
    ]);

    const htmlContent = loadTemplate('welcomeNewsLetter');

    const options = {
      from: '"Rapid Clean Laundry" <kharchiee@outlook.com>',
      to: email,
      subject: "You're in!🎉",
      html: htmlContent
    };

    await sendMail(options);

   return res.status(201).json({
      status: true,
      message: "Subsciber Saved",
    });
  } catch (err) {
    return next(err);
  }
  
 }

 const updateProfile = async (req, res, next) => {
  try {
    const { gender, phone_no, house_address, lga, state, image_url } = req.body;

    const cus_id = req.user.cus_id;

    if ( !gender || !phone_no || !house_address || !lga || !state ) return next(new ErrorResponse("Please input details", 400))

    const connection = await connectDB();

    const updateUser = await runQuery(connection, updatePro, [
      gender,
      phone_no,
      house_address,
      lga,
      image_url,
      state,
      cus_id,
    ])


    req.user = {...req.user, gender, phone_no, house_address, lga, state, image_url}
    console.log("Profile Updated");
    return res.status(200).json({
      status: true,
      message: "Profile Updated",
      data: req.user
    })
  
  } catch (err) {
    return next(err);
  }
 }

//  const countAll


 module.exports = {getAllCustomers, getCustomerID, newsLetterSubs, updateProfile, }