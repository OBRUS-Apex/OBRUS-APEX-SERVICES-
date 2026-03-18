import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get('employerId');
    
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (employerId) {
      query = query.eq('employer_id', employerId);
    } else {
      query = query.eq('status', 'open');
    }

    const { data, error } = await query;
    if (error) throw error;

    const formatted = data.map(job => ({
      _id: job.id,
      employerId: job.employer_id,
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      type: job.type,
      salary: job.salary,
      requirements: job.requirements,
      status: job.status,
      createdAt: job.created_at
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, requirements, category, location, salaryRange, employerId } = await req.json();
    
    // Map the old Mongoose object style to our new Postgres columns
    const formattedSalary = salaryRange ? `₦${salaryRange.min} - ₦${salaryRange.max}` : 'Negotiable';
    const reqArray = typeof requirements === 'string' ? [requirements] : requirements;

    const { data, error } = await supabase.from('jobs').insert([{
      employer_id: employerId,
      title,
      description: description || 'See job details',
      category: category || 'HSE Consultancy',
      location: location || 'Nigeria',
      type: 'Contract', 
      salary: formattedSalary,
      requirements: reqArray || ['To be discussed']
    }]).select().single();

    if (error) throw error;
    data._id = data.id; // Map for frontend
    return NextResponse.json({ success: true, job: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to post job' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { jobId, status } = await req.json();
    if (!jobId || !['open', 'closed'].includes(status)) return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    
    const { data, error } = await supabase.from('jobs').update({ status }).eq('id', jobId).select().single();
    if (error || !data) return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    return NextResponse.json({ success: true, job: data });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ message: 'Job ID required' }, { status: 400 });
    
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  }
