import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone, userType, employerProfile } = body;

    if (!userType) {
      return NextResponse.json({ message: "Registration category is required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "This email is already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let status = 'active';
    let role = 'client';

    if (email === process.env.ADMIN_EMAIL) {
      role = 'admin';
      status = 'active';
    } else if (userType === 'employer') {
      status = 'pending';
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
      role,
      status,
      employerProfile: userType === 'employer' ? employerProfile : undefined
    });

    return NextResponse.json({ 
      success: true, 
      message: status === 'pending' ? "Profile submitted for review" : "Account successfully established",
      userType: newUser.userType
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}