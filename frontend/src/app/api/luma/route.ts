import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No LUMA_API_KEY set" }, { status: 500 });
  }

  const url = "https://api.lu.ma/v1/healthcheck";
  // This is just a placeholder to test if we can connect;
  // Luma might have a different endpoint for health checks or event retrieval.

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-luma-api-key": apiKey,
      },
    });
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
