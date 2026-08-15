"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Bell, BriefcaseBusiness, ChevronRight, ClipboardList, FileText, HardHat, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users, X } from "lucide-react";
import { logoutRequest } from "@/lib/api-client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/dashboard/tasks", label: "Tasks & milestones", icon: ClipboardList },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Bell },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await logoutRequest().catch(() => undefined);
    router.replace("/login");
  };

  const sidebar = <aside className="flex h-full w-[270px] shrink-0 flex-col border-r border-white/8 bg-[#03070d]/40 p-4 backdrop-blur-lg">
    <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl border border-blue-300/10 bg-white/[0.025] p-3">
      <img src="/brand/bubble-engineering-logo.jpeg" alt="BUBBLE Engineering" className="h-10 w-20 rounded-lg object-cover" />
      <div><p className="text-[10px] font-bold tracking-[.2em]">COMMAND</p><p className="mt-1 text-[8px] tracking-[.18em] text-blue-300/55">ENGINEERING HQ</p></div>
    </Link>
    <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/25">Operations</p>
    <nav className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition ${active ? "bg-blue-500/12 text-white shadow-[inset_0_0_0_1px_rgba(67,165,255,.1)]" : "text-white/45 hover:bg-white/5 hover:text-white"}`}><Icon size={16} className={active ? "text-blue-300" : ""} />{label}<ChevronRight size={13} className={`ml-auto transition ${active ? "opacity-60" : "opacity-0 group-hover:opacity-30"}`} /></Link>;
      })}
    </nav>
    <p className="mb-2 mt-8 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/25">System</p>
    <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/45 hover:bg-white/5 hover:text-white"><Settings size={16} /> Settings</Link>
    <div className="mt-auto rounded-2xl border border-blue-300/10 bg-gradient-to-br from-blue-500/10 to-transparent p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-blue-100"><ShieldCheck size={15} /> Secure workspace</div><p className="mt-2 text-[9px] leading-5 text-white/30">Access is controlled by role and permission at the API layer.</p></div>
    <button onClick={signOut} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 hover:bg-red-500/10 hover:text-red-200"><LogOut size={16} /> Sign out</button>
  </aside>;

  return <div className="min-h-screen bg-[#020407]/35 text-white backdrop-blur-lg lg:flex">
    <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/8 bg-[#03070d]/40 px-4 backdrop-blur-lg lg:hidden"><Link href="/dashboard" className="flex items-center gap-2"><HardHat size={18} className="text-blue-300" /><span className="text-xs font-bold tracking-[.18em]">BUBBLE HQ</span></Link><button onClick={() => setMobileOpen(true)} className="rounded-xl border border-white/10 p-2"><Menu size={18}/></button></div>
    <div className="hidden h-screen lg:sticky lg:top-0 lg:flex">{sidebar}</div>
    {mobileOpen && <div className="fixed inset-0 z-[60] lg:hidden"><button className="absolute inset-0 bg-black/70" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /><div className="relative h-full w-[280px]">{sidebar}<button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg border border-white/10 p-2"><X size={16}/></button></div></div>}
    <main className="min-w-0 flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-10 lg:pt-8">{children}</main>
  </div>;
}
