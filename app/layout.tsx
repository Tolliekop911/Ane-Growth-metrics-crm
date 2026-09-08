import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANE Growth — Get in touch",
  description: "Tell us about your project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
