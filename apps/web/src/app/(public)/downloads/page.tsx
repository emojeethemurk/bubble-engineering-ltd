import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FileDown } from "lucide-react";

const DOCUMENTS = [
  { name: "Company Profile", size: "2.4 MB", type: "PDF" },
  { name: "Safety Policy Summary", size: "540 KB", type: "PDF" },
  { name: "Sustainability Report 2025", size: "3.1 MB", type: "PDF" },
  { name: "Standard Terms & Conditions", size: "310 KB", type: "PDF" },
];

export default function DownloadsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading eyebrow="Downloads" title="Company documents" />
      <div className="glass-card divide-y divide-white/10">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div className="flex items-center gap-3">
              <FileDown size={18} className="text-brand-300" />
              <div>
                <p className="text-sm font-medium text-white">{doc.name}</p>
                <p className="text-xs text-white/40">
                  {doc.type} · {doc.size}
                </p>
              </div>
            </div>
            <Link href="/contact" className="rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-white/90 hover:bg-white/10">Request access</Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-white/35">Public document access can be enabled by the BUBBLE team from the secure content workspace.</p>
    </main>
  );
}
