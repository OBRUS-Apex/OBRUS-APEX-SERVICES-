import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get('employerId');
    // Employer view: all their jobs. Public recruitment page: only open jobs.
    const query = employerId ? { employerId } : { status: 'open' };
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, description, requirements, category, location, salaryRange, employerId } = await req.json();
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

// Toggle open/closed
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { jobId, status } = await req.json();
    if (!jobId || !['open', 'closed'].includes(status)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
    const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
    if (!job) return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Permanent delete
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ message: 'Job ID required' }, { status: 400 });
    await Job.findByIdAndDelete(jobId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
