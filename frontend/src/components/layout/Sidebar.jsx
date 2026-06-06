import {
  CalendarDays,
  ClipboardList,
  DatabaseBackup,
  Hammer,
  LayoutDashboard,
  Package,
  Wallet,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/keuangan", label: "Keuangan", icon: Wallet },
  { to: "/sarpras", label: "Sarpras", icon: Package },
  { to: "/jadwal-dkm", label: "Jadwal DKM", icon: CalendarDays },
  { to: "/proker-dkm", label: "Proker DKM", icon: ClipboardList },
  { to: "/renovasi", label: "Renovasi", icon: Hammer },
  { to: "/backup", label: "Backup", icon: DatabaseBackup },
];

export default function Sidebar({ isOpen, isMobileOpen, onCloseMobile }) {
  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 h-screen w-[280px] bg-ink text-white shadow-2xl transition-all duration-300 ease-in-out",
        "border-r border-white/10",
        isOpen ? "lg:w-[280px]" : "lg:w-[88px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={[
            "flex h-20 shrink-0 items-center gap-2 border-b border-white/10 px-5",
            !isOpen ? "lg:justify-center lg:px-0" : "",
          ].join(" ")}
        >
          <div className="flex h-11 w-11 shrink-0 items-center">
            <img src="../../public/dkmjny.webp" alt="Logo" />
          </div>

          <div className={["min-w-0", !isOpen ? "lg:hidden" : ""].join(" ")}>
            <h2 className="truncate text-lg font-black">DKMJNY</h2>
            <p className="truncate text-xs text-white/50">Digital Masjid</p>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/15 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                title={!isOpen ? item.label : undefined}
                className={({ isActive }) =>
                  [
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition",
                    isActive
                      ? "bg-limey text-ink"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                    !isOpen ? "lg:justify-center lg:px-0" : "",
                  ].join(" ")
                }
              >
                <Icon size={21} className="shrink-0" />
                <span
                  className={["truncate", !isOpen ? "lg:hidden" : ""].join(" ")}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 px-4 py-4">
          <div className={["mt-4", !isOpen ? "lg:hidden" : ""].join(" ")}>
            <div className="w-full rounded-3xl bg-limey p-4 text-ink">
              <p className="text-sm font-black">DKMJNY Digital</p>
              <p className="mt-1 text-xs text-ink/70">
                Kelola masjid lebih cepat dan rapi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
