const nodemailer = require('nodemailer');

exports.createMailTransporter = () => {
     const transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
               user: "kharchiee@outlook.com",
               pass: "Heavenfreak"
          }
     });

     return transporter;
}

// console.log( process.env.EMAIL_ADDRESS)
// console.log(process.env.EMAIL_PASS);