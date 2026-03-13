import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const wrapperStyle = "font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #c8921e; padding: 40px; border-radius: 20px; background: #ffffff;";
const headerBrand = `
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #0b1f3a; margin: 0; font-size: 26px; letter-spacing: -1px;">OBRUS APEX SERVICES</h2>
    <p style="color: #c8921e; font-size: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 3px;">Industrial Excellence</p>
  </div>
`;

export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: `"OBRUS Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Action Required: Reset Your Password',
    html: `
      <div style="${wrapperStyle}">
        ${headerBrand}
        <h3 style="color: #0b1f3a;">Secure Password Reset</h3>
        <p style="color: #444; line-height: 1.6;">You requested a credential reset. Click the button below to establish a new password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #0b1f3a; color: #fff; padding: 16px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Update Credentials</a>
        </div>
        <p style="color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">If you did not initiate this request, no further action is required.</p>
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
    subject: 'Authorization Active: Staff Account Established',
    html: `
      <div style="${wrapperStyle}">
        ${headerBrand}
        <h3 style="color: #0b1f3a;">Welcome to the Team, ${name}</h3>
        <p style="color: #444; line-height: 1.6;">Your node has been activated by the Super Admin. You now have operational clearance for internal dashboards.</p>
        <div style="background: #fcfbf9; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #c8921e;">
           <p style="margin: 0; color: #0b1f3a; font-weight: bold; font-size: 14px;">Next Steps:</p>
           <p style="color: #666; font-size: 13px; margin-top: 5px;">Visit the secure gateway below to access current field inquiries and manpower cycles.</p>
        </div>
        <div style="text-align: center;">
          <a href="${loginUrl}" style="background: #c8921e; color: #060f1e; padding: 18px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(200, 146, 30, 0.2);">Secure Staff Login</a>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendEmployerApprovedEmail = async (email: string, company: string) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth`;
  const mailOptions = {
    from: `"OBRUS Global Recruitment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Industrial Clearance: Employer Profile Approved',
    html: `
      <div style="${wrapperStyle}">
        ${headerBrand}
        <h3 style="color: #0b1f3a;">Verification Complete: ${company}</h3>
        <p style="color: #444; line-height: 1.6;">Our Admin team has completed the audit of your corporate documentation. Your employer account is now fully authorized.</p>
        <p style="color: #666; font-size: 14px;">You can now post manpower requirements and engage OBRUS-vetted candidates directly from your portal.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${loginUrl}" style="background: #0b1f3a; color: #fff; padding: 16px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Access Hiring Portal</a>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendJobOfferEmail = async (email: string, name: string, jobTitle: string) => {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/recruitment`;
  const mailOptions = {
    from: `"OBRUS Careers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recruitment Milestone: New Job Offer Dispatched',
    html: `
      <div style="${wrapperStyle}">
        ${headerBrand}
        <h3 style="color: #0b1f3a;">Offer Notification</h3>
        <p style="color: #444; line-height: 1.6;">Congratulations, ${name}! You have been issued a formal job offer for the role of <b>${jobTitle}</b>.</p>
        <p style="color: #666; font-size: 14px;">Log in to your seeker dashboard to view offer details and next-phase onboarding documentation.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${portalUrl}" style="background: #c8921e; color: #060f1e; padding: 16px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">View Seeker Portal</a>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};