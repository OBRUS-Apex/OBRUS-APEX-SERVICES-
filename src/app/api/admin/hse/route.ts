import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('hse_enquiries').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    const formatted = data.map(eq => ({
      _id: eq.id,
      name: eq.name,
      email: eq.email,
      phone: eq.phone,
      organisation: eq.organisation,
      service: eq.service,
      participants: eq.participants,
      details: eq.details,
      status: eq.status,
      createdAt: eq.created_at
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const { data, error } = await supabase.from('hse_enquiries').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, enquiry: data });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const { error } = await supabase.from('hse_enquiries').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Enquiry Deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
      }
