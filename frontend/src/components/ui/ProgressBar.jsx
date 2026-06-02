export default function ProgressBar({ value }) {
  return <div className="flex items-center gap-3"><div className="h-2.5 w-32 rounded-full bg-black/10"><div className="h-full rounded-full bg-limey" style={{ width: `${Number(value || 0)}%` }} /></div><span className="text-xs font-bold">{value}%</span></div>
}
