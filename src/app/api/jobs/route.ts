import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, requirements, category, location, salaryRange, employerId } = body;

    const job = await Job.create({
      title,
      description: description || 'See job details',
      requirements: requirements || 'To be discussed',
      category: category || 'HSE Consultancy',
      location: location || 'Nigeria',
      salaryRange: salaryRange || { min: 0, max: 0 },
      employerId,
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to post job' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get('employerId');
    const jobs = await Job.find(employerId ? { employerId, status: 'open' } : { status: 'open' })
      .sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
      }
