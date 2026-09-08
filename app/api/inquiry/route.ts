import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Public endpoint the website's contact form posts to.
// CORS is open so it can be called from the live website's domain.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // also accept classic form posts (application/x-www-form-urlencoded)
    try {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid request." },
        { status: 400, headers: CORS }
      );
    }
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const projectType = String(body.project_type || body.projectType || "").trim();
  const message = String(body.message || "").trim();

  // Honeypot — bots fill this hidden field, real people don't.
  if (String(body.company || "").trim() !== "") {
    return NextResponse.json({ ok: true }, { headers: CORS });
  }

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Please add your name." },
      { status: 400, headers: CORS }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please add a valid email." },
      { status: 400, headers: CORS }
    );
  }

  try {
    const { error } = await supabaseAdmin().from("inquiries").insert({
      name,
      email,
      project_type: projectType || null,
      message: message || null,
    });
    if (error) {
      console.error("Insert failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500, headers: CORS }
      );
    }
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "The form isn't connected yet." },
      { status: 500, headers: CORS }
    );
  }
}
