import ResourcePage from '../ResourcePage'

export default function ProkerPage() {
  return <ResourcePage title="Proker DKM" subtitle="Program kerja dan kegiatan masjid." path="/proker-dkm" labelKey="kegiatan_dkm" columns={[
    { key: 'kegiatan_dkm', label: 'Kegiatan' },
    { key: 'waktu_kegiatan', label: 'Waktu Kegiatan' },
    { key: 'tanggal_kegiatan', label: 'Tanggal Kegiatan' }
  ]} fields={[
    { name: 'user_id', label: 'User ID', type: 'number', defaultValue: 1, required: true },
    { name: 'kegiatan_dkm', label: 'Kegiatan', required: true },
    { name: 'waktu_kegiatan', label: 'Waktu Kegiatan', type: 'time', required: true },
    { name: 'tanggal_kegiatan', label: 'Tanggal Kegiatan', type: 'date', required: true }
  ]} />
}
