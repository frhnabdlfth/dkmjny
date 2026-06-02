import ResourcePage from '../ResourcePage'

const jenis = ['Jasa', 'Belanja', 'Renovasi', 'Lainnya']
const money = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)

export default function KeuanganPage() {
  return <ResourcePage title="Keuangan" subtitle="Kelola saldo awal, pemasukan, pengeluaran, dan saldo akhir." path="/keuangan" labelKey="jenis_pengeluaran" canView columns={[
    { key: 'saldo_awal', label: 'Saldo Awal', render: r => money(r.saldo_awal) },
    { key: 'pemasukan', label: 'Pemasukan', render: r => money(r.pemasukan) },
    { key: 'pengeluaran', label: 'Pengeluaran', render: r => money(r.pengeluaran) },
    { key: 'jenis_pengeluaran', label: 'Jenis Pengeluaran' },
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'saldo_akhir', label: 'Saldo Akhir', render: r => money(r.saldo_akhir) }
  ]} fields={[
    { name: 'user_id', label: 'User ID', type: 'number', defaultValue: 1, required: true },
    { name: 'saldo_awal', label: 'Saldo Awal', type: 'number', defaultValue: 0, required: true },
    { name: 'pemasukan', label: 'Pemasukan', type: 'number', defaultValue: 0, required: true },
    { name: 'pengeluaran', label: 'Pengeluaran', type: 'number', defaultValue: 0, required: true },
    { name: 'jenis_pengeluaran', label: 'Jenis Pengeluaran', type: 'select', options: jenis },
    { name: 'tanggal', label: 'Tanggal', type: 'date', required: true }
  ]} />
}
