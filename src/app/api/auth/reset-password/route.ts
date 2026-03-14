import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Security Notice: Verification process initiated" }); 
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    await sendResetEmail(email, resetToken);

    return NextResponse.json({ message: "Authentication link dispatched to inbox" });
  } catch (error: any) {
    return NextResponse.json({ message: "Gateway Communication Error" }, { status: 500 });
  }
}