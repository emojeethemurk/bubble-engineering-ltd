const STATUS_STYLES: Record<string, string> = {
  PLANNING: "bg-slate-400/20 text-slate-200",
  IN_PROGRESS: "bg-brand-500/20 text-brand-300",
  ON_HOLD: "bg-amber-500/20 text-amber-300",
  COMPLETED: "bg-emerald-500/20 text-emerald-300",
  CANCELLED: "bg-red-500/20 text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-white/10 text-white/70";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${style}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-brand-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
