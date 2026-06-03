import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./features/login/LoginPage";
import Dashboard from "./features/dashboard/Dashboard";
import KeuanganPage from "./features/keuangan/KeuanganPage";
import SarprasPage from "./features/sarpras/SarprasPage";
import JadwalPage from "./features/jadwal/JadwalPage";
import ProkerPage from "./features/proker/ProkerPage";
import RenovasiPage from "./features/renovasi/RenovasiPage";
import BackupPage from "./features/backup/BackupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="keuangan" element={<KeuanganPage />} />
          <Route path="sarpras" element={<SarprasPage />} />
          <Route path="jadwal-dkm" element={<JadwalPage />} />
          <Route path="proker-dkm" element={<ProkerPage />} />
          <Route path="renovasi" element={<RenovasiPage />} />
          <Route path="backup" element={<BackupPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
