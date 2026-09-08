import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Delete one inquiry, then redirect back to the inbox.
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const id = String(fd.get("id") || "");
    if (id) {
      await supabaseAdmin().from("inquiries").delete().eq("id", id);
    }
  } catch (e) {
    console.error("delete failed", e);
  }
  return NextResponse.redirect(new URL("/inbox", req.url), 303);
}
