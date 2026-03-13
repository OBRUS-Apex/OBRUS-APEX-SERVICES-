import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import User from '@/models/User';
import { sendJobOfferEmail } from '@/lib/mail';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { applicationId } = await req.json();
    const app = await Application.findByIdAndUpdate(applicationId, { status: 'offered' }).populate('candidateId jobId');
    
    await sendJobOfferEmail(app.candidateId.email, app.candidateId.name, app.jobId.title);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Offer dispatch failed" }, { status: 500 });
  }
}