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
      return NextResponse.json({ message: 'No account found with that email.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect password. Please try again.' }, { status: 401 });
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
        _id: user._id,        // FIX: was 'id' — portals all use user._id
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        userType: user.userType,
        status: user.status,
        employerProfile: user.employerProfile,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Login failed. Please try again.' }, { status: 500 });
  }
}
