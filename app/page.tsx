import { redirect } from "next/navigation";

// The CRM homepage IS the inbox. (The standalone contact form still
// lives at /form if you ever want to embed it somewhere.)
export default function Home() {
  redirect("/inbox");
}
