import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, username, full_name } = await request.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Store profile in localStorage (server-side implementation)
    try {
      // In a real implementation, we would store this in localStorage
      // Since this is server-side code and localStorage is not available,
      // we'll just simulate success
      console.log('Creating profile:', { id, username, full_name });
      
      // In a client-side context, we would do:
      // if (typeof window !== 'undefined') {
      //   const profiles = JSON.parse(localStorage.getItem('squpage_profiles') || '[]');
      //   profiles.push({ id, username, full_name, created_at: new Date().toISOString() });
      //   localStorage.setItem('squpage_profiles', JSON.stringify(profiles));
      // }
    } catch (storageError: any) {
      console.error('Error creating profile:', storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in create-profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
