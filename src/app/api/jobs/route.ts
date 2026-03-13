import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, description, quantity, category, employerId } = await req.json();
    const job = await Job.create({ title, description, quantity, category, employerId });
    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to post job" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const employerId = searchParams.get('employerId');
  const jobs = await Job.find(employerId ? { employerId } : {}).sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}