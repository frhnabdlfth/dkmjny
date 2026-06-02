export default function PageTitle({ title, subtitle, action }) {
  return <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div><h2 className="text-xl font-black text-ink">{title}</h2><p className="text-sm text-black/50">{subtitle}</p></div>{action}
  </div>
}
