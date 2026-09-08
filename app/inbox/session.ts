import { cookies } from "next/headers";

const COOKIE = "inbox_auth";

// Plain server helper (not a server action) — checks whether the
// current visitor has unlocked the inbox with the shared password.
export function isUnlocked(): boolean {
  const expected = process.env.INBOX_PASSWORD || "";
  const got = cookies().get(COOKIE)?.value || "";
  return expected.length > 0 && got === expected;
}

export const COOKIE_NAME = COOKIE;

export const STATUSES = ["new", "contacted", "won", "lost"] as const;
export type Status = (typeof STATUSES)[number];
