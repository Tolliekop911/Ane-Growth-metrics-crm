"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type SubmitResult = { ok: boolean; error?: string };

export async function submitInquiry(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const projectType = String(formData.get("project_type") || "").trim();
  const message = String(formData.get("message") || "").trim();

  // Honeypot: bots fill hidden fields, humans don't.
  if (String(formData.get("company") || "").trim() !== "") {
    return { ok: true }; // silently drop
  }

  if (!name) return { ok: false, error: "Please add your name." };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return { ok: false, error: "Please add a valid email." };

  try {
    const { error } = await supabaseAdmin()
      .from("inquiries")
      .insert({
        name,
        email,
        project_type: projectType || null,
        message: message || null,
      });

    if (error) {
      console.error("Insert failed:", error.message);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: "The form isn't connected yet. Please try again shortly.",
    };
  }
}
