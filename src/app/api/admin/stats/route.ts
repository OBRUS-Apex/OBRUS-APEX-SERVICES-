import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import HseEnquiry from '@/models/HseEnquiry';

export async function GET() {
  try {
    await dbConnect();
    
    const [totalUsers, staffCount, adminCount, hseCount] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'staff' }),
      User.countDocuments({ role: 'admin' }),
      HseEnquiry.countDocuments({})
    ]);

    return NextResponse.json({
      totalUsers,
      staffCount,
      adminCount,
      hseCount,
      revenuePlaceholder: "₦4.2M" 
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}