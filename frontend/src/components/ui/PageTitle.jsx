export default function PageTitle({ title, subtitle, action, onBack }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-ink hover:opacity-70 transition"
            title="Kembali"
          >
            ←
          </button>
        )}
        <div>
          <h2 className="truncate text-xl font-black text-ink sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-black/50">{subtitle}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
