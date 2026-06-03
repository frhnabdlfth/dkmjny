export default function ProgressBar({ value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div className="flex w-full max-w-xs items-center gap-3">
      <div className="h-2.5 min-w-24 flex-1 rounded-full bg-black/10">
        <div className="h-full rounded-full bg-limey" style={{ width: `${safeValue}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-bold">{safeValue}%</span>
    </div>
  );
}
