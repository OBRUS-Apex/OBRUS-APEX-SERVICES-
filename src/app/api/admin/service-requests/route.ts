import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest';

export async function GET() {
  try {
    await dbConnect();
    const requests = await ServiceRequest.find({})
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    const updated = await ServiceRequest.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
