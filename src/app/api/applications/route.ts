import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import User from '@/models/User';
import Job from '@/models/Job';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const employerId = searchParams.get('employerId');
    const candidateId = searchParams.get('candidateId');
    const status = searchParams.get('status');

    let query: any = {};
    if (jobId) query.jobId = jobId;
    if (employerId) query.employerId = employerId;
    if (candidateId) query.candidateId = candidateId;
    if (status) query.status = status;

   
    const applications = await Application.find(query)
      .populate('candidateId', 'name email phone')
      .populate('jobId', 'title category')
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json({ message: "Data retrieval failure" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { jobId, candidateId, employerId, cvUrl } = await req.json();

    if (!jobId || !candidateId || !employerId || !cvUrl) {
      return NextResponse.json({ message: "Incomplete documentation provided" }, { status: 400 });
    }

    
    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return NextResponse.json({ message: "Duplicate submission detected for this node" }, { status: 400 });
    }

    const newApplication = await Application.create({
      jobId,
      candidateId,
      employerId,
      cvUrl,
      status: 'pending' 
    });

    return NextResponse.json({ 
      success: true, 
      message: "Application securely logged in OBRUS registry.",
      id: newApplication._id 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: "Protocol Error: Database synchronization failed" }, { status: 500 });
  }
}