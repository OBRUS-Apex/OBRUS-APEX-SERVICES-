import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendStaffWelcomeEmail } from '@/lib/mail';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { userId, newRole } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.role = newRole;
    await user.save();

    if (newRole === 'staff') {
      try {
        await sendStaffWelcomeEmail(user.email, user.name);
      } catch (mailError) {
        console.error("Email failed but role was updated");
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}