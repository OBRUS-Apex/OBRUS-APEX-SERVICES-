import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Authenticate via Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return NextResponse.json({ message: 'Incorrect email or password. Please try again.' }, { status: 401 });
    }

    // 2. Fetch the custom user profile details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    // 3. Return payload formatted exactly how the frontend expects it
    return NextResponse.json({
      success: true,
      token: authData.session.access_token, // Supabase native JWT
      user: {
        _id: userData.id,        // Keeping '_id' so frontend portals don't break
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        userType: userData.user_type,
        status: userData.status,
        employerProfile: userData.employer_profile,
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Login failed. Please try again.' }, { status: 500 });
  }
          }
