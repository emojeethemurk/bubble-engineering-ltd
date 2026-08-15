"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-blue-300/10 bg-[#02050a]/85 shadow-2xl shadow-blue-950/30 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="BUBBLE Engineering home">
          <div className="logo-lockup overflow-hidden rounded-xl border border-blue-300/15 bg-black/60 shadow-[0_0_35px_rgba(22,119,255,.12)]">
            <img src="/brand/bubble-engineering-logo.jpeg" alt="BUBBLE Engineering Company Limited" className="h-11 w-24 object-cover object-center transition duration-500 group-hover:scale-[1.04]" />
          </div>
          <div className="hidden leading-none sm:block">
            <p className="text-[10px] font-bold tracking-[0.32em] text-white">BUBBLE</p>
            <p className="mt-1 text-[8px] tracking-[0.2em] text-blue-300/70">ENGINEERING COMPANY LIMITED</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-medium uppercase tracking-[0.14em] text-white/60 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="group inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100 transition hover:border-blue-300/40 hover:bg-blue-500/20">
            Command Center <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        <button className="rounded-xl border border-white/10 p-2 text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#03070d]/40 px-4 py-4 backdrop-blur-lg lg:hidden">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 hover:bg-white/5 hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-blue-500 px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white">
            Open Command Center
          </Link>
        </nav>
      )}
    </header>
  );
}
