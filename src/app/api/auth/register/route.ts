import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, userType, employerProfile } = body;

    if (!userType) {
      return NextResponse.json({ message: "Registration category is required" }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        message: "This email is already registered. Please log in instead." 
      }, { status: 400 });
    }

    let status = 'active';
    let role = 'client';

    // FIX: Support multiple admin emails separated by commas in your environment variables
    const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
    
    if (adminEmails.includes(email.toLowerCase())) {
      role = 'admin';
    } else if (userType === 'employer') {
      status = 'pending';
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          phone,
          user_type: userType,
          role,
          status,
          employer_profile: userType === 'employer' ? employerProfile : null
        }
      ]);

    // FIX: Hide raw database output from users
    if (dbError) {
      return NextResponse.json({ message: "Failed to create user profile. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: status === 'pending' ? "Profile submitted for review" : "Account successfully established",
      userType: userType
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}
