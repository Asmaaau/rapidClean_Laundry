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
  transporter.sendMail(mailOptions);

  console.log("Email Verification Sent")
};

// exports.sendVerificationMail = (user, emailToken, next) => {
//   const transporter = createMailTransporter();

//   const mailOptions = {
// //     from: '"Rapid Clean Laundry" <process.env.EMAIL_ADDRESS>',
//     from: 'kharchiee@outlook.com',
//     to: user.email,
//     subject: "Verify your email...",
//     html: `<h1><b>Hello ${user.fullname} 👋,</b></h1>
//           <p>erify your email by clicking the button below,<br>
//           Then log in using your email and password you set</p>
//           <a href='http://localhost:5000/api/user/verify-email?emailToken=${emailToken}' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;'>Verify Your Email</a>
//           <p>This link will remain valid for 1 day. If you have not verified your email address by then, you will have to create another account.</p>
//           `,
//   };
//   console.log("Email Token:", emailToken); 

// //   transporter.sendMail(mailOptions)
//   transporter.sendMail(mailOptions, (error, info) => {
//      if (error) {
//           console.log(error)
//           return next(new ErrorResponse("Could not send verification email, try again", 401))
//      } else {
//           console.log("Verification email sent");
//           return;
//      }
//   });
// };
