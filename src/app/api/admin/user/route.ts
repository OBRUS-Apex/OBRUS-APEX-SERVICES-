import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map Postgres snake_case back to the camelCase your frontend expects
    const formattedUsers = data.map((u: any) => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      userType: u.user_type,
      role: u.role,
      status: u.status,
      employerProfile: u.employer_profile,
      createdAt: u.created_at
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
