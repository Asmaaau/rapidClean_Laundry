const nodemailer = require('nodemailer');

exports.createMailTransporter = () => {
     const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 465,
          // secure: false,
          auth: {
               user: process.env.BREVO_USER,
               pass: process.env.BREVO_PASS
          }
     });

     return transporter;
}

// brevo smtp key - xsmtpsib-95cdf20c07bfbf3012464c5c241b6ee70828129059e749e7b2f92349d31c3b9e-gVUSJWtTOK5pXG1H
// console.log( process.env.EMAIL_ADDRESS)
// console.log(process.env.EMAIL_PASS);