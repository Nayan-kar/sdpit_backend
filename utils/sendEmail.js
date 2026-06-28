const nodemailer = require("nodemailer");

// Create standard transporter using Gmail app password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using transporter
 * @param {Object} options - Email options (to, subject, text, html)
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"SDPIT Support" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
