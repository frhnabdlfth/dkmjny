import ResourcePage from '../ResourcePage'
import ProgressBar from '../../components/ui/ProgressBar'

export default function RenovasiPage() {
  return <ResourcePage title="Renovasi" subtitle="Monitoring jenis, tanggal, dan progress perbaikan." path="/renovasi" labelKey="jenis_perbaikan" columns={[
    { key: 'jenis_perbaikan', label: 'Jenis Perbaikan' },
    { key: 'tanggal_perbaikan', label: 'Tanggal Perbaikan' },
    { key: 'progress', label: 'Progress Perbaikan', render: r => <ProgressBar value={r.progress} /> }
  ]} fields={[
    { name: 'user_id', label: 'User ID', type: 'number', defaultValue: 1, required: true },
    { name: 'jenis_perbaikan', label: 'Jenis Perbaikan', required: true },
    { name: 'tanggal_perbaikan', label: 'Tanggal Perbaikan', type: 'date', required: true },
    { name: 'progress', label: 'Progress', type: 'number', min: 0, max: 100, defaultValue: 0, required: true }
  ]} />
}
