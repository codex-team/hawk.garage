const nodemailer = require('nodemailer');

const config = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER_NAME,
    pass: process.env.MAIL_USER_PASSWORD
  }
};

/**
 * Init transporter with date from config
 */
const transporter = nodemailer.createTransport(config);

/**
 * Send email to specified receiver with subject and text
 *
 * from    - {name:'Hawk.so Team', email:'team@hawk.so'}
 * to      - 'receiver@mail.com'
 * subject
 * text
 * html
 */
function send(to, subject, text, html) {
  const mailOptions = {
    from: `"${process.env.MAIL_HAWK_NAME}" <${process.env.MAIL_HAWK_ADDRESS}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  send
};
