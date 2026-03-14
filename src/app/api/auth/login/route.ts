import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '12h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: { 
        id: user._id,
        name: user.name, 
        role: user.role,
        userType: user.userType,
        status: user.status
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Login execution error" }, { status: 500 });
  }
}