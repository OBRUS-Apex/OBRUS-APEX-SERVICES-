import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Email not found" }, { status: 404 });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 Hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: "OBRUS APEX SERVICES <noreply@obrusapex.com>",
      to: email,
      subject: "Password Reset Request",
      html: `<h3>Password Reset</h3><p>Click below to reset your password. Valid for 1 hour.</p><a href="${resetUrl}">Reset Password</a>`,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}