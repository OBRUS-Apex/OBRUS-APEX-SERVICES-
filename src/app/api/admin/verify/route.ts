import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Application from '@/models/Application';
import { sendEmployerApprovedEmail } from '@/lib/mail';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, type, action } = await req.json();

    if (type === 'employer') {
      const status = action === 'approve' ? 'active' : 'rejected';
      const user = await User.findByIdAndUpdate(
        id, 
        { status, 'employerProfile.isApproved': action === 'approve' },
        { new: true }
      );
      if (action === 'approve') await sendEmployerApprovedEmail(user.email, user.employerProfile.companyName);
      return NextResponse.json({ success: true, message: "Employer Registry Updated" });
    }

    if (type === 'candidate') {
      
      await Application.findByIdAndUpdate(id, { status: action === 'approve' ? 'vetted' : 'rejected' });
      return NextResponse.json({ success: true, message: "Professional Vetting Complete" });
    }

    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: "Security update failure" }, { status: 500 });
  }
}