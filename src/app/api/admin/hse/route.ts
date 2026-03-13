import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HseEnquiry from '@/models/HseEnquiry';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await HseEnquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();

    const enquiry = await HseEnquiry.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await HseEnquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Enquiry Deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}