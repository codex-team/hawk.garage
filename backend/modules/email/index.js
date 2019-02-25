const nodemailer = require('nodemailer');
const path = require('path');
const Twig = require('twig');

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
  if (!text) throw new Error('Email\'s text content must be specified');

  const mailOptions = {
    from: `"${process.env.MAIL_HAWK_NAME}" <${process.env.MAIL_HAWK_ADDRESS}>`, // sender address
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send email to specified receiver with subject with text and html from template
 * @param {string} to - email's receivers
 * @param {string} subject - email's subject
 * @param {string} template - template folder
 * @param {object} [locals] - data for rendering
 */
async function sendFromTemplate(to, subject, template, locals) {
  if (!subject) throw new Error('Email\'s subject must be specified');

  const templatesPath = path.resolve(__dirname, '../../../frontend/yard/views');
  const htmlTemplate = path.join(templatesPath, template, 'html.twig');
  const textTemplate = path.join(templatesPath, template, 'text.twig');

  const html = new Promise((resolve, reject) => {
    Twig.renderFile(htmlTemplate, locals, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });

  const text = new Promise((resolve, reject) => {
    Twig.renderFile(textTemplate, locals, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
  const result = await Promise.all([html, text]);

  return send(to, subject, result[0], result[1]);
}

module.exports = {
  send,
  sendFromTemplate
};
