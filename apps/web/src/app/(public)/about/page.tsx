import { SectionHeading } from "@/components/public/SectionHeading";
import { Target, HeartHandshake, ShieldCheck, Leaf } from "lucide-react";

const VALUES = [
  { icon: Target, title: "Precision", description: "Every milestone is measured, tracked, and reported — nothing is left to chance." },
  { icon: ShieldCheck, title: "Safety first", description: "Zero-compromise site safety standards across every project, every day." },
  { icon: HeartHandshake, title: "Partnership", description: "We work as an extension of our clients' teams, not a vendor at arm's length." },
  { icon: Leaf, title: "Sustainability", description: "Responsible sourcing and reduced-impact building methods wherever possible." },
];

const LEADERSHIP = [
  { name: "Amara Okafor", role: "Managing Director" },
  { name: "David Mwangi", role: "Operations Manager" },
  { name: "Grace Wanjiru", role: "Head of Engineering" },
  { name: "Samuel Otieno", role: "Head of Safety" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="About us"
        title="Two decades of building things that last"
        description="Founded in 2003, we've grown from a small residential contractor into a full-service construction management company delivering commercial, residential, and infrastructure projects across the region."
      />

      <div className="glass-card mb-20 grid gap-8 p-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Our story</h3>
          <p className="text-sm leading-relaxed text-white/60">
            What began as a three-person residential contracting outfit has
            become a company trusted with landmark commercial towers and
            large-scale infrastructure work. The throughline has stayed the
            same: build it right, on time, and be honest with clients when
            plans need to change.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Our approach</h3>
          <p className="text-sm leading-relaxed text-white/60">
            Every project runs through the same in-house platform our clients
            use to track progress — the same daily logs, budgets, and site
            reports our project managers see are visible to you, in real
            time, from planning through handover.
          </p>
        </div>
      </div>

      <SectionHeading eyebrow="What we stand for" title="Our values" />
      <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass-card p-6">
            <Icon size={20} className="mb-3 text-brand-300" />
            <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/60">{description}</p>
          </div>
        ))}
      </div>

      <SectionHeading eyebrow="Leadership" title="The team behind the work" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEADERSHIP.map((person) => (
          <div key={person.name} className="glass-card p-6 text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-900" />
            <p className="text-sm font-semibold text-white">{person.name}</p>
            <p className="text-xs text-white/50">{person.role}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
