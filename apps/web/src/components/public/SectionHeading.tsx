export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-300">
          {eyebrow}
        </p>
      )}
      <h2 className="bg-gradient-to-b from-white to-sky-300 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm text-white/60">{description}</p>}
    </div>
  );
}
