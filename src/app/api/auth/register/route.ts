import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  return NextResponse.json({ 
    status: "active", 
    message: "Operational: Secure Registration Pipeline Active." 
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, userType, employerProfile } = body;

    if (!name || !email || !password || !userType) {
      return NextResponse.json({ message: "Missing required identification fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email node already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let status = 'active';
    let role = 'client';

    if (email === process.env.ADMIN_EMAIL) {
      status = 'active';
      role = 'admin';
    } else if (userType === 'employer') {
      status = 'pending';
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      role,
      status,
      employerProfile: userType === 'employer' ? {
        companyName: employerProfile?.companyName,
        rcNumber: employerProfile?.rcNumber,
        officeAddress: employerProfile?.officeAddress,
        industry: employerProfile?.industry,
        website: employerProfile?.website,
        isApproved: false
      } : undefined
    });

    const successMessage = userType === 'employer' 
      ? "Corporate profile received. Your access is currently pending."
      : "Registration successful.";

    return NextResponse.json({ 
      success: true, 
      message: successMessage,
      userType: newUser.userType,
      status: newUser.status
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Security Protocol Error: Registration failed to synchronize with database" 
    }, { status: 500 });
  }
}