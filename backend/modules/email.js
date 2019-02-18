const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

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
 * @param {string} to - email's receivers
 * @param {string} subject - email's subject
 * @param {string} html - html content of the email
 * @param {string} [text] - plain text content of the email
 */
async function send(to, subject, html, text) {
  if (!subject) throw new Error('Email\'s subject must be specified');
  if (!html) throw new Error('Email\'s html content must be specified');

  if (!text) {
    text = htmlToText.fromString(html, {
      format: {
        heading: function (elem, fn, options) {
          const h = fn(elem.children, options);

          return '\n====' + h.toUpperCase() + '====\n';
        }
      }});
  }

  const mailOptions = {
    from: `"${process.env.MAIL_HAWK_NAME}" <${process.env.MAIL_HAWK_ADDRESS}>`, // sender address
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  send
};
