import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const ledger = await Invoice.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(ledger);
  } catch (error) {
    return NextResponse.json({ message: "Financial sync error" }, { status: 500 });
  }
}