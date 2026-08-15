import { SectionHeading } from "@/components/public/SectionHeading";
import { PlayCircle, Video, Box } from "lucide-react";

const PHOTO_TILES = Array.from({ length: 9 });

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Gallery"
        title="Sites, structures, and the people building them"
      />

      <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PHOTO_TILES.map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-gradient-to-br from-brand-700/70 to-brand-900/70"
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-10 text-center">
          <Video size={28} className="text-brand-300" />
          <h3 className="text-sm font-semibold text-white">Drone footage</h3>
          <p className="text-xs text-white/50">
            Aerial progress footage from active sites, updated monthly.
          </p>
          <button className="mt-2 flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700">
            <PlayCircle size={14} /> Watch latest flyover
          </button>
        </div>
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-10 text-center">
          <Box size={28} className="text-brand-300" />
          <h3 className="text-sm font-semibold text-white">3D project walkthroughs</h3>
          <p className="text-xs text-white/50">
            Interactive 3D tours for select flagship projects.
          </p>
          <button className="mt-2 rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-white/90 hover:bg-white/10">
            Coming soon
          </button>
        </div>
      </div>
    </main>
  );
}
