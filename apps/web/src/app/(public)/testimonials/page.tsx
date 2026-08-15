import { SectionHeading } from "@/components/public/SectionHeading";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "They delivered Meridian Tower two weeks ahead of schedule and kept us informed at every milestone.",
    name: "Janet Kariuki",
    role: "Development Director, Meridian Holdings",
  },
  {
    quote:
      "The client portal alone changed how we work with contractors — we could see daily logs without asking.",
    name: "Peter Nyaga",
    role: "Asset Manager, Riverside Group",
  },
  {
    quote:
      "Safety record across our joint sites has been spotless for three years running.",
    name: "Fatuma Ali",
    role: "Compliance Lead, Northgate Logistics",
  },
];

export default function TestimonialsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="Testimonials" title="What clients say after handover" />
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="glass-card p-6">
            <Quote size={20} className="mb-3 text-brand-300" />
            <p className="mb-4 text-sm text-white/70">"{t.quote}"</p>
            <p className="text-sm font-medium text-white">{t.name}</p>
            <p className="text-xs text-white/40">{t.role}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
