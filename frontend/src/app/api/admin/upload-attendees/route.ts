import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import csvParser from "csv-parser";
import { Readable } from "stream";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const attendees: { email: string; name: string; registered: boolean }[] = [];

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  await new Promise<void>((resolve, reject) => {
    stream
      .pipe(csvParser())
      .on("data", (data: { email?: string; name?: string }) => {
        const email = data.email?.trim().toLowerCase();
        const name = data.name?.trim();
        if (email && name) {
          attendees.push({ email, name, registered: true });
        }
      })
      .on("end", () => resolve())
      .on("error", (error: Error) => reject(error));
  });

  if (attendees.length === 0) {
    return NextResponse.json(
      { error: "No valid attendee data found in CSV." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("attendees")
    .upsert(attendees, { onConflict: "email" });

  if (error) {
    console.error("Supabase Upsert Error:", error);
    return NextResponse.json(
      { error: "Failed to upload attendees." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, count: attendees.length },
    { status: 200 }
  );
}
