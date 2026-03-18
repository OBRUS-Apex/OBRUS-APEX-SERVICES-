import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const employerId = searchParams.get('employerId');
    const candidateId = searchParams.get('candidateId');
    const status = searchParams.get('status');

    // Fetch applications AND join the Candidate details + Job details
    let query = supabase.from('applications')
      .select('*, candidateId:users!candidate_id(name, email, phone), jobId:jobs!job_id(title, category)')
      .order('applied_at', { ascending: false });

    if (jobId) query = query.eq('job_id', jobId);
    if (employerId) query = query.eq('employer_id', employerId);
    if (candidateId) query = query.eq('candidate_id', candidateId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    const formatted = data.map(app => ({
      _id: app.id,
      jobId: app.jobId,
      candidateId: app.candidateId,
      employerId: app.employer_id,
      cvUrl: app.cv_url,
      status: app.status,
      createdAt: app.applied_at
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ message: "Data retrieval failure" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { jobId, candidateId, employerId, cvUrl } = await req.json();

    if (!jobId || !candidateId || !employerId || !cvUrl) {
      return NextResponse.json({ message: "Incomplete documentation provided" }, { status: 400 });
    }

    const { data: existing } = await supabase.from('applications').select('id').eq('job_id', jobId).eq('candidate_id', candidateId).single();
    if (existing) return NextResponse.json({ message: "Duplicate submission detected for this node" }, { status: 400 });

    const { data: newApp, error } = await supabase.from('applications').insert([{
      job_id: jobId,
      candidate_id: candidateId,
      employer_id: employerId,
      cv_url: cvUrl,
      status: 'pending'
    }]).select().single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: "Application securely logged in OBRUS registry.",
      id: newApp.id 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: "Protocol Error: Database synchronization failed" }, { status: 500 });
  }
}
