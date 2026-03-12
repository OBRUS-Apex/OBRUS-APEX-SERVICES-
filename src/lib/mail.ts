import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
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
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #c8921e;">
        <h2 style="color: #0b1f3a;">OBRUS APEX SERVICES</h2>
        <p>You requested a password reset. Click the button below to continue:</p>
        <a href="${resetUrl}" style="background: #c8921e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">This link expires in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};