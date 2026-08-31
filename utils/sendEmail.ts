import nodemailer from "nodemailer";

interface SendEmail {
  email: string;
  subject: string;
  code: string;
  name: string;
}

const sendEmail = async ({ email, subject, code, name }: SendEmail) => {
  // Create transporter "Service that will send email 'gmail - mailgun'"
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
    secure: false,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });

  // Define Email options
  const mailOptions = {
    from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: code,
    html: `
      <div>
        <h1 style="color: #333;">${subject}</h1>
        <p style="color: #666; font-size: 16px; font-weight: 600;">
        أهلاً ${name} 
        </p>
        <p style="color: #666; font-size: 16px; font-weight: 600;">
        رمز التحقق الخاص بك هو: 
        <strong style="color: #333; font-size: 24px; font-weight: 600;">${code}</strong>
        </p>
        <p style="color: #666; font-size: 16px; font-weight: 600;">
        ينتهي صلاحية الرمز خلال 10 دقائق
        </p>
      </div>
    `,
  };

  // Send Email
  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.messageId);

  return info;
};

export default sendEmail;
