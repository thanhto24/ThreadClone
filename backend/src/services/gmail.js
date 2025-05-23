const nodemailer = require('nodemailer');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'threaddev204@gmail.com',
    pass: 'imov dxvl ffyl utna',
  },
});

// Hàm gửi email xác minh
const sendVerificationEmail = async (toEmail) => {
  // Generate mã xác minh
  const verificationCode = Math.floor(1000 + Math.random() * 9000);

  // Cấu hình email
  const mailOptions = {
    from: 'threaddev204@gmail.com',
    to: toEmail,
    subject: 'Code for email confirmation',
    text: `Your verification code is: ${verificationCode}`,  // Nội dung email
  };

  // Gửi email
  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log(verificationCode);
    return { verificationCode, response: info.response };
  } catch (error) {
    throw new Error('Failed to send email: ' + error.message);
  }
};

module.exports = { sendVerificationEmail };