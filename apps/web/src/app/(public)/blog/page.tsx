import { SectionHeading } from "@/components/public/SectionHeading";
import { CalendarDays } from "lucide-react";

const POSTS = [
  {
    title: "How we cut steel delivery delays by 30% this year",
    excerpt:
      "A look at the procurement changes that shortened lead times across three active sites.",
    date: "July 2026",
  },
  {
    title: "Inside Meridian Tower's foundation pour",
    excerpt:
      "6,000 cubic meters of concrete, one continuous 30-hour pour, and the planning behind it.",
    date: "June 2026",
  },
  {
    title: "Why we run every site through the same daily-log system",
    excerpt:
      "The internal tooling that keeps clients and site teams looking at the same numbers.",
    date: "May 2026",
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading eyebrow="Blog" title="Notes from the field" />
      <div className="space-y-6">
        {POSTS.map((post) => (
          <article key={post.title} className="glass-card p-6">
            <p className="mb-2 flex items-center gap-1 text-xs text-white/40">
              <CalendarDays size={12} /> {post.date}
            </p>
            <h2 className="mb-2 text-base font-semibold text-white">{post.title}</h2>
            <p className="text-sm text-white/60">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
