"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isUnlocked, STATUSES, type Status } from "./session";

export async function setStatus(formData: FormData) {
  if (!isUnlocked()) return;
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !STATUSES.includes(status as Status)) return;

  await supabaseAdmin().from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/inbox");
}
