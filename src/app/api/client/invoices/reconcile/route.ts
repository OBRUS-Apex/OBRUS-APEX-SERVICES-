import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { invoiceId, receiptUrl } = await req.json();

    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: 'verifying', receiptUrl },
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Transaction logged for Admin verification.",
      invoice 
    });
  } catch (error) {
    return NextResponse.json({ message: "Payment reconciliation failed" }, { status: 500 });
  }
}