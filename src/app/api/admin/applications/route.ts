import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { applicationId, status } = await req.json(); // status: 'vetted' or 'rejected'

    if (!applicationId || !status) {
      return NextResponse.json({ message: "Target ID and Status required" }, { status: 400 });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ message: "Application node not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Identity marked as ${status}. Verification cycle updated.` 
    });

  } catch (error: any) {
    return NextResponse.json({ message: "Internal Vetting Error" }, { status: 500 });
  }
}