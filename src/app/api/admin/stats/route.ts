import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Run all count queries in parallel for maximum speed
    const [
      { count: totalUsers }, 
      { count: hseCount }, 
      { count: staffCount }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('hse_enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'staff')
    ]);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      hseCount: hseCount || 0,
      staffCount: staffCount || 0,
      adminCount: 1
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
