const nodemailer = require('nodemailer');

exports.createMailTransporter = () => {
     const transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
               user: process.env.EMAIL_ADDRESS,
               pass: process.env.EMAIL_PASS
          }
     });

     return transporter;
}