import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { id, type, action } = await req.json();

    if (!id || !type || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Determine the correct status string based on the action
    let newStatus = '';
    if (action === 'approve') {
      newStatus = type === 'employer' ? 'active' : 'vetted';
    } else if (action === 'reject') {
      newStatus = 'rejected';
    }

    // Employers live in the users table, Candidate applications live in the applications table
    if (type === 'employer') {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
    } else if (type === 'candidate') {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: 'Status updated' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  }
