import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic. Reports what the server sees without leaking secrets.
export async function GET() {
  const out: Record<string, unknown> = {};

  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  out.urlHost = (() => {
    try {
      return new URL(url).host;
    } catch {
      return "INVALID_OR_MISSING (" + JSON.stringify(url.slice(0, 20)) + ")";
    }
  })();

  // Decode the JWT payload to read the "role" claim (anon vs service_role).
  out.keyRole = (() => {
    try {
      const payload = JSON.parse(
        Buffer.from(key.split(".")[1] || "", "base64").toString("utf8")
      );
      return { role: payload.role, ref: payload.ref };
    } catch {
      return "COULD_NOT_DECODE (len=" + key.length + ")";
    }
  })();

  // Try a read.
  try {
    const r = await supabaseAdmin()
      .from("inquiries")
      .select("id,name,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(3);
    out.read = { count: r.count, error: r.error?.message || null, sample: r.data };
  } catch (e) {
    out.read = { threw: e instanceof Error ? e.message : String(e) };
  }

  // Try a write, then read it back in the SAME request.
  try {
    const marker = "debug-" + Date.now();
    const ins = await supabaseAdmin()
      .from("inquiries")
      .insert({ name: marker, email: "debug@debug.com" })
      .select("id");
    const back = await supabaseAdmin()
      .from("inquiries")
      .select("id,name")
      .eq("name", marker);
    out.write = {
      insertError: ins.error?.message || null,
      inserted: ins.data,
      readBackCount: back.data?.length ?? 0,
      readBackError: back.error?.message || null,
    };
  } catch (e) {
    out.write = { threw: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(out);
}
