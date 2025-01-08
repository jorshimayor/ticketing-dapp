import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/superbase';

interface LumaAttendee {
  email: string;
  name: string;
}

export async function POST() {
  const apiKey = process.env.LUMA_API_KEY;
  const LUMA_EVENT_ID = 'LUMA_EVENT_ID';

  try {
    const res = await fetch(`https://api.lu.ma/v1/events/${LUMA_EVENT_ID}/attendees`, {
      headers: {
        'Content-Type': 'application/json',
        'x-luma-api-key': apiKey || '',
      },
    });
    const data = await res.json();

    const attendees = data.attendees || [];
    const { error } = await supabase
      .from('attendees')
      .upsert(
        attendees.map((att: LumaAttendee) => ({
          email: att.email,
          name: att.name,
          registered: true,
        })),
        { onConflict: 'email' }
      );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, count: attendees.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
