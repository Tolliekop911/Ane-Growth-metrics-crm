import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { STATUSES, type Status } from "../../inbox/session";

// Plain route handler (NOT a server action) so it can't fail during the
// Server Components render. Updates a lead's status, then redirects back.
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const id = String(fd.get("id") || "");
    const status = String(fd.get("status") || "");
    if (id && STATUSES.includes(status as Status)) {
      await supabaseAdmin().from("inquiries").update({ status }).eq("id", id);
    }
  } catch (e) {
    console.error("status update failed", e);
  }
  return NextResponse.redirect(new URL("/inbox", req.url), 303);
}
