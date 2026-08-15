import { SectionHeading } from "@/components/public/SectionHeading";
import { ShieldCheck, HardHat, ClipboardList, AlertTriangle } from "lucide-react";

const PRACTICES = [
  { icon: HardHat, title: "Daily toolbox talks", description: "Every crew starts the day with a site-specific safety briefing." },
  { icon: ClipboardList, title: "Incident reporting", description: "Near-misses and incidents are logged and reviewed within 24 hours." },
  { icon: AlertTriangle, title: "Risk registers", description: "Every project maintains a live risk register reviewed weekly by site management." },
  { icon: ShieldCheck, title: "Certified training", description: "All site personnel complete OSHA-aligned safety certification before deployment." },
];

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Safety"
        title="Zero-compromise site safety"
        description="Safety data is tracked in the same platform as project progress — nothing is siloed."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {PRACTICES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass-card p-6">
            <Icon size={20} className="mb-3 text-brand-300" />
            <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/60">{description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
