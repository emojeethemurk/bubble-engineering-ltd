import { SectionHeading } from "@/components/public/SectionHeading";
import {
  Building2,
  Home as HomeIcon,
  Waves,
  Wrench,
  Ruler,
  ClipboardCheck,
} from "lucide-react";

const SERVICES = [
  {
    icon: Building2,
    title: "Commercial Construction",
    description:
      "Office towers, retail centers, hotels, and mixed-use developments — delivered from design coordination through fit-out.",
  },
  {
    icon: HomeIcon,
    title: "Residential Development",
    description:
      "Single-family, multi-unit, and gated community construction, with phased delivery for large developments.",
  },
  {
    icon: Waves,
    title: "Infrastructure & Civil Works",
    description:
      "Roads, bridges, drainage, and utility infrastructure built to municipal and national standards.",
  },
  {
    icon: Wrench,
    title: "Renovation & Retrofit",
    description:
      "Structural upgrades, seismic retrofits, and adaptive reuse of existing buildings.",
  },
  {
    icon: Ruler,
    title: "Design & Pre-Construction",
    description:
      "Feasibility studies, BOQ preparation, value engineering, and permitting support before ground breaks.",
  },
  {
    icon: ClipboardCheck,
    title: "Project & Construction Management",
    description:
      "Full-time on-site management, subcontractor coordination, and client reporting for the life of the project.",
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Services"
        title="Everything a project needs, under one roof"
        description="We manage the full lifecycle in-house so nothing gets lost between contractors."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
              <Icon size={20} />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/60">{description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
