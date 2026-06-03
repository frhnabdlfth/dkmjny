export default function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <h2 className="truncate text-xl font-black text-ink sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-black/50">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
