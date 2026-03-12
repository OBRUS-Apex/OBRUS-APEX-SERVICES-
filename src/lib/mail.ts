import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', 
  host: process.env.EMAIL_HOST,                 
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"OBRUS APEX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Action Required: Reset Your OBRUS Portal Password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #c8921e; padding: 40px; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0b1f3a; margin: 0; font-size: 28px;">OBRUS APEX</h1>
          <p style="color: #c8921e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-top: 5px; font-weight: bold;">Apex Services</p>
        </div>
        <h2 style="color: #0b1f3a; font-size: 20px; text-align: center;">Security: Password Reset</h2>
        <p style="color: #64748b; line-height: 1.6; text-align: center;">
          A password reset was requested for your OBRUS Integrated Services account. 
          If you did not request this, please ignore this email.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${resetUrl}" style="background-color: #0b1f3a; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password Now</a>
        </div>
        <p style="color: #94a3b8; font-size: 11px; margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          This link is strictly valid for 1 hour. <br/> 
          © 2026 OBRUS APEX SERVICES. Port Harcourt, Nigeria.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};