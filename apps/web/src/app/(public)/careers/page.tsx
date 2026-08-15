import { SectionHeading } from "@/components/public/SectionHeading";
import { MapPin, Briefcase } from "lucide-react";

const OPEN_ROLES = [
  { title: "Site Engineer", location: "Nairobi", type: "Full-time" },
  { title: "Quantity Surveyor", location: "Mombasa", type: "Full-time" },
  { title: "Procurement Officer", location: "Nairobi", type: "Full-time" },
  { title: "Safety Officer", location: "Multiple sites", type: "Full-time" },
  { title: "Site Driver (Heavy Equipment)", location: "Ruiru", type: "Contract" },
];

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Careers"
        title="Build your career alongside real, lasting work"
        description="We hire for the long term — most of our site leads started on the tools."
      />

      <div className="glass-card mb-4 divide-y divide-white/10">
        {OPEN_ROLES.map((role) => (
          <div
            key={role.title}
            className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-white">{role.title}</p>
              <p className="flex items-center gap-1 text-xs text-white/50">
                <MapPin size={12} /> {role.location} · <Briefcase size={12} /> {role.type}
              </p>
            </div>
            <a
              href="mailto:careers@construction.example"
              className="rounded-xl bg-brand-500 px-4 py-2 text-center text-xs font-medium text-white hover:bg-brand-700"
            >
              Apply
            </a>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-white/40">
        Don't see the right role? Send your CV to{" "}
        <a href="mailto:careers@construction.example" className="text-brand-300 hover:underline">
          careers@construction.example
        </a>
      </p>
    </main>
  );
}
