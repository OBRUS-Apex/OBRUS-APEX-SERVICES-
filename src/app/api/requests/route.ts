import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, serviceType, location, priority, targetDate, details } = body;

    const { data, error } = await supabase
      .from('service_requests')
      .insert([{
        user_id: userId || null,
        service_type: serviceType,
        location,
        priority: priority || 'Normal Ops',
        target_date: targetDate,
        details
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, request: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
