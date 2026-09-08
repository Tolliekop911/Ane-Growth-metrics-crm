"use client";

import { useEffect } from "react";

// Plain client-side redirect to the inbox. Kept fully separate from the
// inbox module (no server-side redirect, no re-export) so it can't affect
// the inbox route's server actions.
export default function Home() {
  useEffect(() => {
    window.location.replace("/inbox");
  }, []);
  return null;
}
