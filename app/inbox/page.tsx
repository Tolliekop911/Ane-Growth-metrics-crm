import { supabaseAdmin, type Inquiry } from "@/lib/supabaseAdmin";
import { STATUSES } from "./session";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function InboxPage() {
  let rows: Inquiry[] = [];
  let loadError = "";
  try {
    const { data, error } = await supabaseAdmin()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) loadError = error.message;
    else rows = (data as Inquiry[]) || [];
  } catch (e) {
    loadError =
      "Couldn't reach the database. Check the Supabase environment variables in Vercel.";
  }

  const counts = {
    total: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    won: rows.filter((r) => r.status === "won").length,
  };

  return (
    <main className="wrap">
      <header className="topbar">
        <div className="brand">ane</div>
        <span className="tagline">Inquiries</span>
      </header>

      <div className="head">
        <h1>Inquiries</h1>
        <div className="stats">
          <span>
            <strong>{counts.total}</strong> total
          </span>
          <span>
            <strong>{counts.new}</strong> new
          </span>
          <span>
            <strong>{counts.won}</strong> won
          </span>
        </div>
      </div>

      {loadError && <p className="error">{loadError}</p>}

      {!loadError && rows.length === 0 && (
        <p className="empty">
          No inquiries yet. When someone submits the contact form, they&apos;ll
          show up here automatically.
        </p>
      )}

      <div className="list">
        {rows.map((r) => (
          <article key={r.id} className={"card status-" + r.status}>
            <div className="cardtop">
              <div>
                <div className="name">{r.name}</div>
                <a className="email" href={`mailto:${r.email}`}>
                  {r.email}
                </a>
              </div>
              <div className="meta">
                {r.project_type && <span className="tag">{r.project_type}</span>}
                <span className="date">{fmt(r.created_at)}</span>
              </div>
            </div>
            {r.message && <p className="msg">{r.message}</p>}
            <form action="/api/status" method="post" className="statusrow">
              <input type="hidden" name="id" value={r.id} />
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  className={"chip" + (r.status === s ? " on" : "")}
                >
                  {s}
                </button>
              ))}
            </form>
          </article>
        ))}
      </div>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
.wrap { max-width: 820px; margin: 0 auto; padding: 24px 24px 80px; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0 24px; border-bottom: 1px solid var(--line); margin-bottom: 32px;
}
.brand { font-family: Georgia, serif; font-style: italic; font-size: 24px; }
.tagline { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); }
.head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 26px; flex-wrap: wrap; gap: 12px; }
.head h1 { font-family: Georgia, serif; font-weight: 400; font-size: 32px; margin: 0; }
.stats { display: flex; gap: 22px; font-size: 13px; color: var(--muted); }
.stats strong { color: var(--text); font-weight: 700; }
.empty, .error { color: var(--muted); line-height: 1.6; }
.error { color: #e88a7d; }
.list { display: flex; flex-direction: column; gap: 14px; }
.card {
  background: var(--panel); border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: 12px; padding: 20px 22px;
}
.card.status-new { border-left-color: #d8c48a; }
.card.status-contacted { border-left-color: #7fa8d8; }
.card.status-won { border-left-color: #86c58a; }
.card.status-lost { border-left-color: #8a8175; }
.cardtop { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.name { font-size: 16px; font-weight: 600; }
.email { font-size: 13px; color: var(--muted); text-decoration: none; }
.email:hover { color: var(--text); }
.meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.tag {
  font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--text); background: var(--panel-2); border: 1px solid var(--line);
  padding: 4px 10px; border-radius: 999px;
}
.date { font-size: 12px; color: var(--muted-2); }
.msg { color: var(--text); opacity: .85; line-height: 1.55; font-size: 14px; margin: 14px 0 4px; white-space: pre-wrap; }
.statusrow { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
.chip {
  background: transparent; border: 1px solid var(--line); color: var(--muted);
  padding: 6px 14px; border-radius: 999px; font-size: 11px; letter-spacing: .08em;
  text-transform: uppercase; cursor: pointer; transition: all .15s ease;
}
.chip:hover { color: var(--text); border-color: var(--muted); }
.chip.on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
`;
