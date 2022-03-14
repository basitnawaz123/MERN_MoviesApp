const nodemailer = require("nodemailer");
const user = process.env.USER;
const pass = process.env.PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: "NovaInternship",
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for registration. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.BASE_URL}/register?confirm_code=${confirmationCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

const sendRecoveryEmail = (name, email, reset_token) => {
  transport
    .sendMail({
      from: "NovaInternship",
      to: email,
      subject: "Reset Password",
      html: `<h1>Password recovery</h1>
        <h2>Hello ${name}</h2>
        <p>Please click the link below to change your password</p>
        <a href=${process.env.BASE_URL}/auth/update?reset_token=${reset_token}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports = {
  sendConfirmationEmail,
  sendRecoveryEmail,
};
