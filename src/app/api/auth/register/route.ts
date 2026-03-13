import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  return NextResponse.json({ 
    status: "active", 
    message: "Registration endpoint is live." 
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Account already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'client';

    await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });

    return NextResponse.json({ 
      success: true, 
      message: `Account created successfully as ${role}` 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: "Server Error: Could not connect to database" 
    }, { status: 500 });
  }
}