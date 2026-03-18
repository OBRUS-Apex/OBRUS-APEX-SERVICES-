import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { applicationId, status } = await req.json(); 

    if (!applicationId || !status) {
      return NextResponse.json({ message: "Target ID and Status required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Application node not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Identity marked as ${status}. Verification cycle updated.` 
    });

  } catch (error: any) {
    return NextResponse.json({ message: "Internal Vetting Error" }, { status: 500 });
  }
}
