import { useState } from 'react'
import AppShell from './components/layout/AppShell'
import Dashboard from './features/dashboard/Dashboard'
import KeuanganPage from './features/keuangan/KeuanganPage'
import SarprasPage from './features/sarpras/SarprasPage'
import JadwalPage from './features/jadwal/JadwalPage'
import ProkerPage from './features/proker/ProkerPage'
import RenovasiPage from './features/renovasi/RenovasiPage'
import BackupPage from './features/backup/BackupPage'

const pages = { dashboard: <Dashboard/>, keuangan: <KeuanganPage/>, sarpras: <SarprasPage/>, jadwal: <JadwalPage/>, proker: <ProkerPage/>, renovasi: <RenovasiPage/>, backup: <BackupPage/> }

export default function App() {
  const [active, setActive] = useState('dashboard')
  return <AppShell active={active} setActive={setActive}>{pages[active]}</AppShell>
}
