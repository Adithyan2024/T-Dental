import transporter from '../config/mailer.js';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"T-Dent Care" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err };
  }
};

export default sendEmail;
