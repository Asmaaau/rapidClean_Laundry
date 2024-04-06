const { createMailTransporter } = require("./createMailTransporter");

exports.sendMail = async (options) => {
  const transporter = createMailTransporter();

  const mailOptions = {
//     from: '"Rapid Clean Laundry" <process.env.EMAIL_ADDRESS>',
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html
  };
//   transporter.sendMail(mailOptions)
  transporter.sendMail(mailOptions, (err, info)=>{
    if(err){
      console.log(err)
    }
    else {
      console.log("Email Verification Sent")
    }
  });

  // console.log("Email Verification Sent")
};
