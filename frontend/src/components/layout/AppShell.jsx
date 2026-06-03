import { useMemo, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const pageMeta = {
  "/dashboard": {
    title: "Welcome back, Admin 👋",
    subtitle: "Dashboard manajemen DKMJNY",
  },
  "/keuangan": {
    title: "Keuangan",
    subtitle: "Kelola pemasukan, pengeluaran, dan saldo akhir.",
  },
  "/sarpras": {
    title: "Sarpras",
    subtitle: "Kelola inventaris dan kondisi barang masjid.",
  },
  "/jadwal-dkm": {
    title: "Jadwal DKM",
    subtitle: "Kelola imam, khatib, dan muadzin.",
  },
  "/proker-dkm": {
    title: "Proker DKM",
    subtitle: "Kelola program kerja dan agenda kegiatan masjid.",
  },
  "/renovasi": {
    title: "Renovasi",
    subtitle: "Pantau progress perbaikan dan renovasi.",
  },
  "/backup": {
    title: "Backup",
    subtitle: "Backup dan kelola arsip database.",
  },
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const meta = useMemo(
    () => pageMeta[location.pathname] ?? pageMeta["/dashboard"],
    [location.pathname],
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 text-ink">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div
        className={[
          "flex min-h-screen w-full min-w-0 flex-col transition-[padding] duration-300 ease-in-out",
          sidebarOpen ? "lg:pl-[280px]" : "lg:pl-[88px]",
        ].join(" ")}
      >
        <header className="sticky top-0 z-30 border-b border-black/5 bg-gray-100/90 backdrop-blur-xl">
          <div className="flex min-h-20 w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Buka menu"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-sm lg:hidden"
              >
                <Menu size={22} />
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-sm transition hover:bg-black/[0.02] lg:flex"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-black leading-tight sm:text-2xl">
                  {meta.title}
                </h1>
                <p className="truncate text-xs text-muted sm:text-sm">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            <div className="flex justify-end items-center gap-4">
              <div className="hidden min-w-[320px] max-w-sm flex-1 items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 shadow-sm md:flex lg:max-w-md">
                <Search size={18} className="text-black/35" />
                <input
                  type="search"
                  placeholder="Cari data..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-limey to-pink-200 font-black shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="w-full max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
