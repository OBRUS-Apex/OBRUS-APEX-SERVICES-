import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ message: "Application ID is required" }, { status: 400 });
    }

    // Update the application status to 'offered'
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'offered' })
      .eq('id', applicationId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
