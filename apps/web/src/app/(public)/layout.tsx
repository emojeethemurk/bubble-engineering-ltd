import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";

// The global cinematic background (construction photo, stars, particles) is
// mounted once in the root layout so it's shared across every route. This
// layout stays transparent so that shared background shows through.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10">
        <PublicNavbar />
        {children}
        <PublicFooter />
      </div>
    </div>
  );
}
