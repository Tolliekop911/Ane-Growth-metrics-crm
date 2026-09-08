import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin, type Inquiry } from "@/lib/supabaseAdmin";
import { STATUSES } from "./session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(iso: string) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${date} · ${time}`;
  } catch {
    return iso;
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  noStore();

  let all: Inquiry[] = [];
  let loadError = "";
  try {
    const { data, error } = await supabaseAdmin()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) loadError = error.message;
    else all = (data as Inquiry[]) || [];
  } catch {
    loadError =
      "Couldn't reach the database. Check the Supabase environment variables in Vercel.";
  }

  const active = searchParams?.status || "all";
  const rows = active === "all" ? all : all.filter((r) => r.status === active);

  const count = (s: string) =>
    s === "all" ? all.length : all.filter((r) => r.status === s).length;

  const TABS = ["all", ...STATUSES];

  return (
    <main className="wrap">
      <header className="topbar">
        <div className="brand">ane</div>
        <div className="brandmeta">Growth Metrics · Inquiries</div>
      </header>

      <section className="hero">
        <h1>INQUIRIES</h1>
        <div className="tiles">
          <div className="tile">
            <span className="num">{all.length}</span>
            <span className="lbl">Total</span>
          </div>
          <div className="tile">
            <span className="num">{count("new")}</span>
            <span className="lbl">New</span>
          </div>
          <div className="tile">
            <span className="num">{count("won")}</span>
            <span className="lbl">Won</span>
          </div>
        </div>
      </section>

      <nav className="tabs">
        {TABS.map((t) => (
          <a
            key={t}
            href={t === "all" ? "/inbox" : `/inbox?status=${t}`}
            className={"tab" + (active === t ? " on" : "")}
          >
            {t} <span className="tabnum">{count(t)}</span>
          </a>
        ))}
      </nav>

      {loadError && <p className="notice error">{loadError}</p>}

      {!loadError && rows.length === 0 && (
        <p className="notice">
          {active === "all"
            ? "No inquiries yet. When someone submits the contact form, they'll appear here automatically."
            : `Nothing marked "${active}" right now.`}
        </p>
      )}

      <div className="list">
        {rows.map((r) => (
          <article key={r.id} className={"card status-" + r.status}>
            <div className="cardhead">
              <div className="who">
                <div className="avatar">{initials(r.name)}</div>
                <div>
                  <div className="name">{r.name}</div>
                  <a className="email" href={`mailto:${r.email}`}>
                    {r.email}
                  </a>
                </div>
              </div>
              <div className="right">
                <span className={"badge b-" + r.status}>{r.status}</span>
                <span className="date">{fmt(r.created_at)}</span>
              </div>
            </div>

            {r.project_type && (
              <div className="tags">
                {r.project_type.split(",").map((t, i) => (
                  <span key={i} className="tag">
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}

            {r.message && <p className="msg">{r.message}</p>}

            <div className="cardfooter">
              <form action="/api/status" method="post" className="statusrow">
                <input type="hidden" name="id" value={r.id} />
                <span className="setlabel">Set status</span>
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
              <form action="/api/delete" method="post" className="delform">
                <input type="hidden" name="id" value={r.id} />
                <button type="submit" className="delbtn" aria-label="Delete inquiry">
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&display=swap');

.wrap {
  max-width: 940px; margin: 0 auto; padding: 40px 28px 100px;
  font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
}
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 22px; border-bottom: 1px solid var(--line); margin-bottom: 44px;
}
.brand { font-family: Georgia, serif; font-style: italic; font-size: 26px; letter-spacing: -0.01em; }
.brandmeta { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }

.hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 30px; }
.hero h1 {
  font-family: 'Anton', sans-serif; font-weight: 400;
  font-size: clamp(3rem, 9vw, 5.5rem); line-height: 0.9; margin: 0;
  letter-spacing: -0.01em; color: var(--text);
}
.tiles { display: flex; gap: 12px; }
.tile {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 84px; padding: 14px 18px; border: 1px solid var(--line);
  border-radius: 14px; background: var(--panel);
}
.tile .num { font-family: 'Anton', sans-serif; font-size: 30px; line-height: 1; }
.tile .lbl { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-top: 6px; }

.tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
.tab {
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line);
  color: var(--muted); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600;
  transition: all .15s ease;
}
.tab:hover { color: var(--text); border-color: var(--muted); }
.tab.on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.tabnum { font-size: 11px; opacity: .7; font-weight: 700; }
.tab.on .tabnum { opacity: .55; }

.notice { color: var(--muted); line-height: 1.6; font-size: 15px; padding: 30px 0; }
.notice.error { color: #e88a7d; }

.list { display: flex; flex-direction: column; gap: 16px; }
.card {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; padding: 22px 24px; overflow: hidden;
}
.card::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--line);
}
.card.status-new::before { background: #e0c979; }
.card.status-contacted::before { background: #7fa8d8; }
.card.status-won::before { background: #86c58a; }
.card.status-lost::before { background: #6b6357; }

.cardhead { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.who { display: flex; gap: 14px; align-items: center; }
.avatar {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--panel-2); border: 1px solid var(--line);
  font-weight: 700; font-size: 14px; letter-spacing: 0.04em; color: var(--text);
}
.name { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
.email { font-size: 13px; color: var(--muted); text-decoration: none; }
.email:hover { color: var(--text); text-decoration: underline; }
.right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.badge {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700;
  padding: 5px 11px; border-radius: 999px; border: 1px solid var(--line); color: var(--text);
}
.b-new { background: rgba(224,201,121,0.14); border-color: rgba(224,201,121,0.4); color: #e6d296; }
.b-contacted { background: rgba(127,168,216,0.14); border-color: rgba(127,168,216,0.4); color: #9dc0e6; }
.b-won { background: rgba(134,197,138,0.16); border-color: rgba(134,197,138,0.45); color: #98d69c; }
.b-lost { background: transparent; color: var(--muted); }
.date { font-size: 12px; color: var(--muted-2); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.tag {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
  color: var(--muted); background: var(--panel-2); border: 1px solid var(--line);
  padding: 5px 11px; border-radius: 8px;
}
.msg {
  color: var(--text); opacity: .9; line-height: 1.6; font-size: 14.5px;
  margin: 16px 0 4px; white-space: pre-wrap;
  border-left: 2px solid var(--line); padding-left: 14px;
}
.cardfooter { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--line); flex-wrap: wrap; }
.statusrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.delform { flex-shrink: 0; }
.delbtn {
  background: transparent; border: 1px solid transparent; color: var(--muted-2);
  padding: 7px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.06em;
  text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all .15s ease;
}
.delbtn:hover { color: #e88a7d; border-color: rgba(232,138,125,0.4); }
.setlabel { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted-2); margin-right: 4px; }
.chip {
  background: transparent; border: 1px solid var(--line); color: var(--muted);
  padding: 7px 15px; border-radius: 999px; font-size: 11px; letter-spacing: 0.06em;
  text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all .15s ease;
}
.chip:hover { color: var(--text); border-color: var(--muted); }
.chip.on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

@media (max-width: 560px) {
  .hero { align-items: flex-start; }
  .right { align-items: flex-start; }
}
`;
