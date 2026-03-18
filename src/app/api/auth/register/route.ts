import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // The new client we created

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, userType, employerProfile } = body;

    if (!userType) {
      return NextResponse.json({ message: "Registration category is required" }, { status: 400 });
    }

    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    let status = 'active';
    let role = 'client';

    // Same admin check logic as before
    if (email === process.env.ADMIN_EMAIL) {
      role = 'admin';
    } else if (userType === 'employer') {
      status = 'pending';
    }

    // 2. Insert profile data into our Postgres users table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user!.id, // Links directly to Supabase Auth UUID
          name,
          email,
          phone,
          user_type: userType,
          role,
          status,
          employer_profile: userType === 'employer' ? employerProfile : null
        }
      ]);

    if (dbError) {
      // Cleanup auth user if DB insert fails (optional but good practice)
      return NextResponse.json({ message: "Failed to create user profile" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: status === 'pending' ? "Profile submitted for review" : "Account successfully established",
      userType: userType
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
            }
