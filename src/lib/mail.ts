import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"OBRUS Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Action Required: Reset Your OBRUS Password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #c8921e; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 25px;">
           <h2 style="color: #0b1f3a; margin: 0;">OBRUS APEX SERVICES</h2>
        </div>
        <h3 style="color: #0b1f3a;">Security Notification</h3>
        <p style="color: #444; line-height: 1.6;">You requested to reset your password. Click the secure button below to continue. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #0b1f3a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset My Password</a>
        </div>
        <p style="color: #888; font-size: 12px;">If you didn't request this, your account is safe and no action is required.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendStaffWelcomeEmail = async (email: string, name: string) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth`;

  const mailOptions = {
    from: `"OBRUS Operations" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Notification: Staff Account Activated - OBRUS Apex',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #c8921e; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 25px;">
           <h2 style="color: #0b1f3a; margin: 0;">OBRUS APEX SERVICES</h2>
           <p style="color: #c8921e; font-size: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">Excellence & Precision</p>
        </div>
        <h3 style="color: #0b1f3a;">Welcome to the Operations Team, ${name}!</h3>
        <p style="color: #444; line-height: 1.6;">An Administrator has officially upgraded your account to <b>Staff Status</b>. You now have access to manage client enquiries, safety requests, and operational dashboards.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
           <p style="margin: 0; color: #0b1f3a; font-weight: bold;">Staff Access Instructions:</p>
           <ul style="color: #555; font-size: 14px; margin-top: 10px;">
              <li>Log in using your existing credentials.</li>
              <li>You will automatically be redirected to the Staff Management Portal.</li>
              <li>Always ensure compliance with our data privacy guidelines.</li>
           </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${loginUrl}" style="background: #c8921e; color: #060f1e; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(200, 146, 30, 0.2);">Login to Staff Portal</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0 20px;" />
        <p style="color: #999; font-size: 11px; text-align: center;">This is an automated system notification for internal staff members of OBRUS Integrated Services.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};