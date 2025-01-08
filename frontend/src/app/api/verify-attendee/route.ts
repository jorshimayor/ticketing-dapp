import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/superbase';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('attendees')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error) {
    return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Attendee not found.' }, { status: 404 });
  }

  // If they've minted, or if there's another restriction, handle that here.
  return NextResponse.json({ success: true, attendee: data });
}
