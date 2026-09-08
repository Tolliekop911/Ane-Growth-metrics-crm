"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry, type SubmitResult } from "../actions";

const PROJECT_TYPES = [
  "Social Media",
  "Content Creation",
  "Google Ads",
  "Meta Ads",
  "Strategy",
  "Other",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="submit" disabled={pending}>
      {pending ? "SENDING…" : "SEND INQUIRY"}
      {!pending && <span className="arrow">→</span>}
    </button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useFormState<SubmitResult | null, FormData>(
    submitInquiry,
    null
  );
  const [selected, setSelected] = useState<string>("");

  if (state?.ok) {
    return (
      <main className="wrap">
        <div className="thanks">
          <div className="brand">ane</div>
          <h1>Thank you.</h1>
          <p>
            Your inquiry is in — we&apos;ve got it on record and someone from
            the team will be in touch soon.
          </p>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  return (
    <main className="wrap">
      <header className="topbar">
        <div className="brand">ane</div>
        <nav>
          <span>SERVICES</span>
          <span>PROCESS</span>
          <span>PRICING</span>
        </nav>
      </header>

      <form action={formAction} className="form">
        <div className="row">
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" placeholder="John Doe" autoComplete="name" />
          </div>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="field">
          <span className="label">Project Type</span>
          <div className="pills">
            {PROJECT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                className={"pill" + (selected === t ? " active" : "")}
                onClick={() => setSelected(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <input type="hidden" name="project_type" value={selected} />
        </div>

        <div className="field">
          <label className="label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about your project goals…"
          />
        </div>

        {/* Honeypot — hidden from humans */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="honeypot"
          aria-hidden="true"
        />

        {state?.error && <p className="error">{state.error}</p>}

        <div className="divider" />
        <SubmitButton />
      </form>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
.wrap {
  max-width: 1012px;
  margin: 0 auto;
  padding: 24px 28px 80px;
  min-height: 100vh;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 28px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 56px;
}
.topbar nav {
  display: flex;
  gap: 40px;
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--muted);
}
.brand {
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 26px;
  color: var(--text);
  letter-spacing: -0.01em;
}
.form { max-width: 650px; }
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.field { margin-bottom: 34px; }
input, textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--line);
  color: var(--text);
  font-size: 16px;
  padding: 6px 0 10px;
  outline: none;
  font-family: inherit;
  transition: border-color .2s ease;
}
textarea { resize: vertical; line-height: 1.5; }
input::placeholder, textarea::placeholder { color: var(--muted-2); }
input:focus, textarea:focus { border-color: var(--text); }
.pills { display: flex; flex-wrap: wrap; gap: 12px; }
.pill {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
  padding: 11px 20px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.12em;
  font-weight: 600;
  cursor: pointer;
  transition: all .18s ease;
}
.pill:hover { border-color: var(--muted); color: var(--text); }
.pill.active {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
}
.honeypot { position: absolute; left: -9999px; opacity: 0; height: 0; }
.divider { border-top: 1px solid var(--line); margin: 40px 0 30px; }
.submit {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: var(--accent);
  color: var(--accent-ink);
  border: none;
  padding: 18px 34px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.18em;
  font-weight: 700;
  cursor: pointer;
  transition: transform .15s ease, opacity .2s ease;
}
.submit:hover:not(:disabled) { transform: translateX(2px); }
.submit:disabled { opacity: .6; cursor: default; }
.arrow { font-size: 15px; }
.error {
  color: #e88a7d;
  font-size: 13px;
  margin: 4px 0 0;
}
.thanks { padding: 60px 0; max-width: 520px; }
.thanks h1 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 40px;
  margin: 30px 0 16px;
}
.thanks p { color: var(--muted); line-height: 1.6; font-size: 16px; }
@media (max-width: 620px) {
  .row { grid-template-columns: 1fr; gap: 0; }
  .topbar nav { display: none; }
}
`;
