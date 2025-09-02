import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { id, username, full_name } = await request.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Use admin client to bypass RLS policies
    const { error } = await supabaseAdmin.from('profiles').insert({
      id,
      username,
      full_name
    });

    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in create-profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
