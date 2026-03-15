import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ServiceRequest from '@/models/ServiceRequest';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const newRequest = await ServiceRequest.create(data);
    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to submit service request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json([]);
    const history = await ServiceRequest.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch requests' }, { status: 500 });
  }
}
