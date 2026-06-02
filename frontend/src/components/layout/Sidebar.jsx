import {
  CalendarDays,
  DatabaseBackup,
  Gauge,
  Hammer,
  Landmark,
  Menu,
  PackageCheck,
  WalletCards,
} from "lucide-react";

const menus = [
  ["dashboard", "Dashboard", Gauge],
  ["keuangan", "Keuangan", WalletCards],
  ["sarpras", "Sarpras", PackageCheck],
  ["jadwal", "Jadwal DKM", CalendarDays],
  ["proker", "Proker DKM", Landmark],
  ["renovasi", "Renovasi", Hammer],
  ["backup", "Backup", DatabaseBackup],
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="flex h-full min-h-[760px] w-[220px] flex-col rounded-[26px] bg-ink p-4 text-white">
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink font-black">
          D
        </div>
        <div>
          <p className="text-lg font-black">DKMJNY</p>
          <p className="text-xs text-white/50">Masjid Digital</p>
        </div>
      </div>
      <nav className="space-y-2">
        {menus.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active === key ? "bg-limey text-ink" : "text-white/80 hover:bg-white/10"}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-3xl bg-limey p-4 text-ink">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-white">
          <Menu size={18} />
        </div>
        <p className="text-sm font-black">Admin Panel</p>
        <p className="text-xs text-black/60">
          Kelola operasional masjid dengan cepat.
        </p>
      </div>
    </aside>
  );
}
