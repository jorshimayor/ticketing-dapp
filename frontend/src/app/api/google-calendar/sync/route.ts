import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: string;
}

const calendar = google.calendar('v3');

export async function POST() {
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY as string;
  const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID as string;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
    return NextResponse.json(
      { error: 'Missing Google Calendar API credentials.' },
      { status: 500 }
    );
  }

  try {
    // Authenticate using a service account
    const jwtClient = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure proper line breaks
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    await jwtClient.authorize();

    // Fetch events from the specified calendar
    const res = await calendar.events.list({
      auth: jwtClient,
      calendarId: GOOGLE_CALENDAR_ID,
      maxResults: 10, // Adjust as needed
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items || [];

    let attendees: CalendarAttendee[] = [];

    events.forEach((event) => {
      if (event.attendees) {
        const eventAttendees = event.attendees.map((att) => ({
          email: att.email,
          displayName: att.displayName,
          responseStatus: att.responseStatus,
        }));
        attendees = attendees.concat(eventAttendees);
      }
    });

    // Remove duplicates based on email
    const uniqueAttendeesMap: Record<string, CalendarAttendee> = {};
    attendees.forEach((att) => {
      if (att.email) {
        uniqueAttendeesMap[att.email.toLowerCase()] = att;
      }
    });
    const uniqueAttendees = Object.values(uniqueAttendeesMap);

    // Upsert attendees into Supabase
    const { error } = await supabase
      .from('attendees')
      .upsert(
        uniqueAttendees.map((att: CalendarAttendee) => ({
          email: att.email,
          name: att.displayName || '',
          registered: true,
        })),
        { onConflict: 'email' }
      );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: uniqueAttendees.length });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while syncing attendees.' },
      { status: 500 }
    );
  }
}
