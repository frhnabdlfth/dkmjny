import { useState, useRef, useEffect } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Settings, LogOut, Download } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { logout } from "../../lib/auth";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

export default function AppShell() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);


  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUserProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setCurrentUser(res.data);
      setForm({
        username: res.data.username,
        email: res.data.email,
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setLoading(true);

      await api.put(`/user/${currentUser.id}`, {
        username: form.username,
        email: form.email,
        password: form.password || null,
      });

      toast.success("Akun berhasil diperbarui");
      setAccountModal(false);
      loadUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Gagal memperbarui akun");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

useEffect(() => {
  const handler = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstallBanner(true);
  };
  const onInstalled = () => setShowInstallBanner(false);

  window.addEventListener("beforeinstallprompt", handler);
  window.addEventListener("appinstalled", onInstalled);
  return () => {
    window.removeEventListener("beforeinstallprompt", handler);
    window.removeEventListener("appinstalled", onInstalled);
  };
}, []);

const handleInstall = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") setShowInstallBanner(false);
  setDeferredPrompt(null);
};

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 text-ink">
      {showInstallBanner && (
  <div className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between gap-3 bg-gradient-to-r from-limey to-emerald-400 px-4 sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-2.5">
      <img src="/dkmjny.webp" alt="logo" className="w-6 h-6" />
      <p className="truncate text-sm font-semibold text-gray-900">
        <span className="hidden sm:inline">Kelola masjid lebih mudah — </span>
        Install aplikasi DKMJNY di perangkat Anda!
      </p>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={handleInstall}
        className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-gray-800"
      >
        <Download size={13} />
        Install
      </button>
      <button
        onClick={() => setShowInstallBanner(false)}
        aria-label="Tutup"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-800 transition hover:bg-black/10 text-lg leading-none"
      >
        ×
      </button>
    </div>
  </div>
)}
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
          "flex min-h-screen w-full min-w-0 flex-col transition-[padding] duration-300 ease-in-out", showInstallBanner ? "pt-32" : "pt-20",
          sidebarOpen ? "lg:pl-[280px]" : "lg:pl-[88px]",
        ].join(" ")}
      >
        <header
          className={[
  "fixed right-0 z-30 border-b border-black/5 bg-gray-100/50 backdrop-blur-xl",
  "left-0 transition-[left,top] duration-300 ease-in-out",
  showInstallBanner ? "top-12" : "top-0",
  sidebarOpen ? "lg:left-[280px]" : "lg:left-[88px]",
].join(" ")}
        >
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
                {sidebarOpen ? (
                  <PanelLeftClose size={22} />
                ) : (
                  <PanelLeftOpen size={22} />
                )}
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-black leading-tight sm:text-2xl">
                   {`Ahlan wa sahlan, ${currentUser?.username || "Admin"} 👋`}
                </h1>
              </div>
            </div>

            <div className="flex justify-end items-center gap-4">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-limey to-pink-200 font-black shadow-sm uppercase"
                >
                  {currentUser?.username ? currentUser.username.charAt(0) : "A"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl z-50">
                    <button
                      onClick={async () => {
                        setProfileOpen(false);
                        setAccountModal(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <Settings size={18} />
                      Pengaturan Akun
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutModal(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="w-full max-w-none">
            <Outlet context={{ currentUser }} />
          </div>
        </main>
      </div>

      <AnimatePresence>
        {logoutModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold">Konfirmasi Logout</h2>

              <p className="mt-2 text-sm text-gray-500">
                Apakah Anda yakin ingin keluar dari aplikasi?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setLogoutModal(false)}
                  className="btn-ghost w-full sm:w-auto"
                >
                  Batal
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {accountModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAccountModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold">Pengaturan Akun</h2>

              <p className="mt-1 text-sm text-gray-500">
                Ubah informasi akun Anda.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        username: e.target.value,
                      })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password Baru
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Kosongkan jika tidak diubah"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setAccountModal(false)}
                  className="btn-ghost"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleUpdateAccount}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
