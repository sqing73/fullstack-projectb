const nodemailer = require("nodemailer");

const sendEmail = async (email, content) => {
  if (!email || !content) {
    throw new Error("Missing email or content");
  }

  const USER = process.env.EMAIL;
  const PASS = process.env.PASSWORD;

  if (!USER || !PASS) {
    throw new Error("Email or password are not found in env");
  }

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: USER,
      pass: PASS,
    },
  });

  await transporter.sendMail({
    from: "Employee Managment",
    to: email,
    subject: "Registration invitation",
    html: content,
  });
};

module.exports = sendEmail;
