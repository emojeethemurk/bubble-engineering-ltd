import type { Metadata } from "next";
import "./globals.css";
import { SiteBackdrop } from "@/components/public/SiteBackdrop";

export const metadata: Metadata = {
  title: { default: "BUBBLE Engineering Company Limited", template: "%s | BUBBLE Engineering" },
  description: "BUBBLE Engineering Company Limited — building today, engineering tomorrow.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: { title: "BUBBLE Engineering Company Limited", description: "Building today. Engineering tomorrow.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // SiteBackdrop is mounted exactly once here so the same cinematic
  // construction background, starfield and particle layers are shared
  // across every route (public site, login, dashboard) without spawning
  // duplicate Three.js canvases or animation loops on navigation.
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <SiteBackdrop />
        {children}
      </body>
    </html>
  );
}
