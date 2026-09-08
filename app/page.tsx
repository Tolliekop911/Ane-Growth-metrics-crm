// The CRM homepage IS the inbox — render it directly (no redirect, which
// can misbehave when Vercel tries to prerender the root route).
export { default } from "./inbox/page";
export const dynamic = "force-dynamic";
