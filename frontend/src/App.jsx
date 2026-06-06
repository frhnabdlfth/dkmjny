import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./features/login/LoginPage"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const KeuanganPage = lazy(() => import("./features/keuangan/KeuanganPage"));
const SarprasPage = lazy(() => import("./features/sarpras/SarprasPage"));
const JadwalPage = lazy(() => import("./features/jadwal/JadwalPage"));
const ProkerPage = lazy(() => import("./features/proker/ProkerPage"));
const RenovasiPage = lazy(() => import("./features/renovasi/RenovasiPage"));
const BackupPage = lazy(() => import("./features/backup/BackupPage"));

function SuspenseFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-lg font-medium text-gray-500">Memuat...</div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "15px",
          },
        }}
      />
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
    </Suspense>
  );
}
