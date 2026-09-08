"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "./session";

export async function unlock(_prev: string | null, formData: FormData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.INBOX_PASSWORD || "";

  if (!expected) return "The inbox password isn't configured yet.";
  if (password !== expected) return "Wrong password. Try again.";

  cookies().set(COOKIE_NAME, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect("/inbox");
}

export async function lock() {
  cookies().delete(COOKIE_NAME);
  redirect("/inbox");
}
