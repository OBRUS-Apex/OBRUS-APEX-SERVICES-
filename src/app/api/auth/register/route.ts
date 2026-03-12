import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword, role: 'client' });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}