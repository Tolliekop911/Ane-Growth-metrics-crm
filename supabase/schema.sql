-- ═══════════════════════════════════════════════════════════════
--  ANE Growth CRM — database setup
--
--  HOW TO RUN (owner does this once):
--    1. Open your Supabase project
--    2. Left sidebar → "SQL Editor" → "New query"
--    3. Paste this whole file in and click "Run"
--
--  That's it — this creates the table that stores every inquiry
--  that comes through the website contact form.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  project_type text,
  message      text,
  -- simple pipeline status so it works like a mini CRM
  status       text not null default 'new'
);

-- Newest inquiries first, fast.
create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

-- Turn on Row Level Security. We add NO public policies, so the
-- anonymous/public key cannot read or write this table at all.
-- The app talks to it using the secret service_role key on the
-- server, which bypasses RLS. This keeps every visitor's contact
-- details private.
alter table public.inquiries enable row level security;
