import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the secret service_role key.
// This is NEVER imported into a client component, so the key stays
// on the server and is never shipped to the browser.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  project_type: string | null;
  message: string | null;
  status: string;
};
