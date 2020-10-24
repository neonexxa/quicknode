const nodemailer = require('nodemailer');

async function sendMailForgotPassword(url, user) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true, // true for 465, false for other ports
      // requireTLS: true, //if using gmail(587)
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
    const info = await transporter.sendMail({
      from: `"OFO Support Team" <${process.env.MAIL_USERNAME}>`,
      to: `${user.email}`,
      subject: 'Request For Password Reset', // Subject line
      html: `
      Greetings ${user.name},<br><br>
      Request reset password at BandarOS! <br>
      Please click on the following link to reset your password:<br><br>
      <a href="${url}">Reset Password<a><br><br>
      If the above does not appear to be clickable, please copy this URL <a href="${url}">${url}<a> and paste it in your web browser. You need to follow this instruction in order to reset password for your account.
      <br><br>

      Best regards,<br><br>

      OFO Support Team`, // html body
    });
    console.log('Message sent: %s', info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log('fail to send email', error);
  }
}
// Route Open
module.exports = sendMailForgotPassword;
