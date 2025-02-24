import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

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
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Attendee not found.' }, { status: 404 });
  }

  // If the attendee has already minted, prevent minting
  if (data.registered) {
    return NextResponse.json({ error: 'Attendee has already minted their ticket.' }, { status: 400 });
  }

  // If the attendee hasn't minted, allow them to mint, and mark them as registered
  // (but this part happens AFTER the minting process in the frontend, not here in the verify endpoint)
  return NextResponse.json({ success: true, attendee: data });
}