import { SectionHeading } from "@/components/public/SectionHeading";
import { Leaf, Recycle, Sun, Droplets } from "lucide-react";

const INITIATIVES = [
  { icon: Recycle, title: "Material recycling", description: "Concrete and steel waste diverted from landfill on every active site." },
  { icon: Sun, title: "Low-carbon energy", description: "Solar-powered site offices and progressive transition to electric plant equipment." },
  { icon: Droplets, title: "Water management", description: "Rainwater harvesting and greywater reuse systems on eligible projects." },
  { icon: Leaf, title: "Responsible sourcing", description: "Preference for FSC-certified timber and regionally sourced materials." },
];

export default function SustainabilityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Sustainability"
        title="Building with a lighter footprint"
        description="Practical steps we take on every project, not just flagship developments."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {INITIATIVES.map(({ icon: Icon, title, description }) => (
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
