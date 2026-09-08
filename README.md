# ANE Growth — Contact CRM

A simple, human system: the **website contact form** saves every inquiry into
**Supabase**, and the team reads them on a private **inbox** page — no accounts,
just one shared password.

- `/` — the contact form (goes on the website)
- `/inbox` — the recordkeeper (password-protected list of everyone who reached out)

---

## How the pieces fit

```
Visitor fills form  →  saved to Supabase (owner's project)  →  team reads /inbox
```

The app talks to Supabase **only from the server**, using the secret
service_role key, so visitors' contact details are never exposed publicly.

---

## Setup (one time)

### 1. Database — in the owner's Supabase
1. Open the Supabase project → **SQL Editor** → **New query**.
2. Paste everything from [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   This creates the `inquiries` table.

### 2. Get the keys — Supabase → **Project Settings → API**
- Project URL  → `SUPABASE_URL`
- `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Deploy on Vercel
1. Import this GitHub repo into Vercel (**New Project → Import**).
2. Add three **Environment Variables** (Settings → Environment Variables):

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role secret key |
   | `INBOX_PASSWORD` | any password you choose for the team |

3. Deploy. Your form is live at the Vercel URL; the inbox is at `/inbox`.

### 4. Put the form on the website
Either link/redirect the website's "Contact" button to the form URL, or
embed the deployed page in an `<iframe>`.

---

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000 (form) and http://localhost:3000/inbox (inbox).

---

## Notes
- **Change the inbox password** any time in Vercel — no redeploy of code needed.
- The inbox has a **Lock** button to sign out on shared computers.
- Status chips (new / contacted / won / lost) let you track each lead like a
  lightweight CRM.
