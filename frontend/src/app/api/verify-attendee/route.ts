import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// POST handler to verify attendee
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Query Supabase for the attendee
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

  if (data) {
    return NextResponse.json({ error: 'Attendee has already minted their ticket.' }, { status: 400 });
  }

  return NextResponse.json({ success: true, attendee: data });
}
