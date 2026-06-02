import { useEffect, useState } from 'react'
import { CalendarDays, Hammer, PackageCheck, PackageX, Wrench } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../lib/api'
import ProgressBar from '../../components/ui/ProgressBar'

function StatCard({ icon: Icon, title, value, tone = 'bg-limey' }) {
  return <div className="card p-5"><div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon size={20}/></div><p className="text-sm text-black/50">{title}</p><p className="text-3xl font-black text-ink">{value}</p></div>
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/dashboard').then(res => setData(res.data)).catch(() => setData(null)) }, [])
  const summary = data?.sarpras || { bagus: 0, rusak: 0, perlu_diperbaiki: 0 }
  return <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={PackageCheck} title="Barang Bagus" value={summary.bagus} />
        <StatCard icon={PackageX} title="Barang Rusak" value={summary.rusak} tone="bg-red-100" />
        <StatCard icon={Wrench} title="Harus Diperbaiki" value={summary.perlu_diperbaiki} tone="bg-orange-100" />
      </div>
      <div className="card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-black text-ink">Chart Keuangan</h2><span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold">Pemasukan vs Pengeluaran</span></div>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.finance_chart || []}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="tanggal"/><YAxis/><Tooltip/><Legend/><Bar dataKey="pemasukan"/><Bar dataKey="pengeluaran"/></BarChart></ResponsiveContainer></div>
      </div>
      <div className="card p-5"><h2 className="mb-4 font-black text-ink">Progress Renovasi</h2><div className="space-y-4">{(data?.renovations || []).map(item => <div key={item.id} className="flex items-center justify-between rounded-2xl bg-black/[0.02] p-4"><div><p className="font-bold text-ink">{item.jenis_perbaikan}</p><p className="text-xs text-black/50">{item.tanggal_perbaikan}</p></div><ProgressBar value={item.progress}/></div>)}</div></div>
    </section>
    <aside className="space-y-5">
      <div className="card bg-ink p-5 text-white"><div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-limey text-ink"><Hammer size={20}/></div><h3 className="text-xl font-black">DKMJNY Digital</h3><p className="mt-2 text-sm text-white/60">Manajemen masjid terpusat untuk admin.</p></div>
      <div className="card p-5"><div className="mb-4 flex items-center gap-2"><CalendarDays size={18}/><h2 className="font-black text-ink">Schedule Kegiatan</h2></div><div className="space-y-3">{(data?.schedules || []).map(item => <div key={item.id} className="rounded-2xl bg-black/[0.03] p-4"><p className="font-bold text-ink">{item.kegiatan_dkm}</p><p className="text-xs text-black/50">{item.tanggal_kegiatan} • {item.waktu_kegiatan}</p></div>)}</div></div>
      <div className="card p-5"><h2 className="mb-3 font-black text-ink">Kalender Pengingat</h2><div className="grid grid-cols-7 gap-2 text-center text-xs">{['S','M','T','W','T','F','S'].map((d,i)=><b key={i}>{d}</b>)}{Array.from({ length: 35 }, (_, i) => <span key={i} className={`rounded-full py-2 ${i === 16 ? 'bg-limey font-black' : 'bg-black/[0.03]'}`}>{i+1}</span>)}</div></div>
    </aside>
  </div>
}
