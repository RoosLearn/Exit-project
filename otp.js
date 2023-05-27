const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const OTP = mongoose.model('OTP', otpSchema);

async function sendEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  let mailOptions = {
    from: 'panchoosparadise@gmail.com',
    to: 'jwbanija@gmail.com',
    subject: 'Nodemailer Project',
    text: `Your OTP: ${otp}`
  };
  

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

module.exports = { OTP, sendEmail };

