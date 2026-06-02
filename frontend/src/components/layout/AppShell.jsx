import Sidebar from "./Sidebar";
import { Search } from "lucide-react";

export default function AppShell({ active, setActive, children }) {
  return (
    <main className="min-h-screen bg-gray-100 p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl gap-5 rounded-[30px] bg-white p-5 shadow-sm">
        <Sidebar active={active} onNavigate={setActive} />
        <section className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-black text-ink">
                Welcome back, Admin 👋
              </h1>
              <p className="text-sm text-black/50">
                Dashboard manajemen DKMJNY
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-black/50">
                <Search size={16} />
                <input
                  className="bg-transparent outline-none"
                  placeholder="Cari data..."
                />
              </div>
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-limey to-fuchsia-300" />
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
