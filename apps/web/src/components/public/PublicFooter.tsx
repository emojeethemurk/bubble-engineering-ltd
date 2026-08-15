import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#010204]/30 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_.7fr_.7fr] lg:px-10">
        <div>
          <div className="flex items-center gap-4"><img src="/brand/bubble-engineering-logo.jpeg" alt="BUBBLE Engineering" className="h-16 w-32 rounded-xl object-cover" /><div><p className="text-sm font-bold tracking-[.22em]">BUBBLE</p><p className="mt-1 text-[8px] tracking-[.2em] text-blue-300/60">ENGINEERING COMPANY LIMITED</p></div></div>
          <p className="mt-5 max-w-sm text-xs leading-6 text-white/35">Design. Engineer. Innovate. Build. Deliver. A digital-first construction experience built around the realities of project delivery.</p>
        </div>
        <div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-300/60">Explore</p><div className="mt-4 space-y-3">{[["/projects","Projects"],["/services","Services"],["/about","About"],["/careers","Careers"]].map(([href,label])=><Link key={href} href={href} className="block text-xs text-white/45 hover:text-white">{label}</Link>)}</div></div>
        <div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-300/60">Digital</p><div className="mt-4 space-y-3">{[["/login","Command Center"],["/contact","Start a project"],["/downloads","Downloads"]].map(([href,label])=><Link key={href} href={href} className="block text-xs text-white/45 hover:text-white">{label}</Link>)}</div></div>
      </div>
      <div className="border-t border-white/5 px-5 py-5 text-center text-[9px] uppercase tracking-[.2em] text-white/25">Building today. Engineering tomorrow.</div>
    </footer>
  );
}
