import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  
  // Format for frontend
  const formattedData = data.map(req => ({
    _id: req.id,
    userId: req.user_id,
    serviceType: req.service_type,
    location: req.location,
    priority: req.priority,
    targetDate: req.target_date,
    details: req.details,
    status: req.status,
    createdAt: req.created_at
  }));

  return NextResponse.json(formattedData, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, serviceType, location, priority, targetDate, details } = body;

    const { data, error } = await supabase
      .from('service_requests')
      .insert([{
        user_id: userId,
        service_type: serviceType,
        location,
        priority,
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
