import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Supabase join syntax for the user info
    const { data, error } = await supabase
      .from('service_requests')
      .select('*, userId:users!user_id(name, email, phone)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = data.map(req => ({
      _id: req.id,
      userId: req.userId,
      serviceType: req.service_type,
      location: req.location,
      priority: req.priority,
      targetDate: req.target_date,
      details: req.details,
      status: req.status,
      createdAt: req.created_at
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const { data, error } = await supabase.from('service_requests').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, request: data });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
                             }
