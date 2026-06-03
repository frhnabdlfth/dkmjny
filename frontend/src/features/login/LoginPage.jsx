import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

import { getAuthUser, login } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [form, setForm] = useState({
    email: "admin@dkmjny.com",
    password: "admin123",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (authUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      login(form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal");
    }
  };

  return (
    <main className="grid min-h-screen w-full bg-paper lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-limey/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-limey/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div>
            <h1 className="text-xl font-black">DKMJNY</h1>
            <p className="text-sm text-white/50">Digital Masjid Management</p>
          </div>
        </div>

        <motion.div
          className="relative z-10 max-w-xl"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-5 w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-limey">
            Sistem Admin Masjid
          </p>

          <h2 className="text-5xl font-black leading-tight">
            Kelola masjid lebih rapi, cepat, dan digital.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-white/60">
            Pantau keuangan, sarpras, jadwal DKM, proker, renovasi, dan backup
            database dalam satu dashboard.
          </p>
        </motion.div>

        <div className="relative z-10 rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm text-white/60">Login dummy</p>
          <p className="mt-1 font-bold">admin@dkmjny.com / admin123</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="rounded-[34px] bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-7">
              <p className="mb-2 text-sm font-bold text-lime-700">
                Selamat datang kembali
              </p>
              <h2 className="text-3xl font-black text-ink">Login Admin</h2>
              <p className="mt-2 text-sm text-black/50">
                Masuk untuk mengelola dashboard DKMJNY.
              </p>
            </div>

            {error && (
              <motion.div
                className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">
                  Email
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-soft px-4 py-3 focus-within:border-limey">
                  <Mail size={18} className="text-black/40" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-black/30"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">
                  Password
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-soft px-4 py-3 focus-within:border-limey">
                  <Lock size={18} className="text-black/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-black/30"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-black/40 transition hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <motion.button
                type="submit"
                className="mt-2 w-full rounded-2xl bg-limey px-5 py-3.5 text-sm font-black text-ink shadow-sm transition hover:brightness-95"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Masuk Dashboard
              </motion.button>
            </form>

            <div className="mt-5 rounded-2xl bg-black/[0.03] p-4 text-xs text-black/50">
              <p className="font-bold text-ink">User dummy:</p>
              <p>Email: admin@dkmjny.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}