import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  DollarSign,
  PackageCheck,
  PackageX,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../../lib/api";
import ProgressBar from "../../components/ui/ProgressBar";

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const money = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v || 0);

function parseDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildCalendarDays(activeDate) {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDayIndex = firstDate.getDay();
  const totalDays = lastDate.getDate();

  const days = [];

  for (let index = 0; index < firstDayIndex; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function StatCard({ icon: Icon, title, value, tone = "bg-limey", delay = 0 }) {
  return (
    <motion.div
      variants={cardMotion}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className="card p-4 sm:p-5"
    >
      <div
        className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${tone}`}
      >
        <Icon size={20} />
      </div>
      <p className="text-sm text-black/50">{title}</p>
      <p className="text-3xl font-black text-ink">{value}</p>
    </motion.div>
  );
}

function EventDetailModal({ date, events, onClose }) {
  if (!date || !events?.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] grid place-items-center bg-black/45 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-[28px] bg-white p-5 shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                Detail Kegiatan
              </p>
              <h3 className="text-xl font-black text-ink">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(date)}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black/5 transition hover:bg-black/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.id}
                layout
                className="rounded-2xl border border-black/5 bg-black/[0.03] p-4"
              >
                <p className="font-black text-ink">{event.kegiatan_dkm}</p>
                <p className="mt-1 text-sm text-black/50">
                  {event.tanggal_kegiatan} • {event.waktu_kegiatan}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RealCalendar({ schedules = [] }) {
  const today = useMemo(() => new Date(), []);
  const [activeDate, setActiveDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarDays = useMemo(
    () => buildCalendarDays(activeDate),
    [activeDate],
  );

  const eventsByDate = useMemo(() => {
    return schedules.reduce((acc, item) => {
      if (!item.tanggal_kegiatan) return acc;

      if (!acc[item.tanggal_kegiatan]) {
        acc[item.tanggal_kegiatan] = [];
      }

      acc[item.tanggal_kegiatan].push(item);

      return acc;
    }, {});
  }, [schedules]);

  const selectedEvents = selectedDate
    ? eventsByDate[formatDateKey(selectedDate)] || []
    : [];

  const goToPreviousMonth = () => {
    setActiveDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setActiveDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const isSameDate = (firstDate, secondDate) => {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  };

  return (
    <>
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-ink">Kalender Pengingat</h2>
            <p className="text-xs text-black/40">{getMonthLabel(activeDate)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="grid h-8 w-8 place-items-center rounded-xl bg-black/[0.04] text-sm font-black transition hover:bg-black/[0.08]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="grid h-8 w-8 place-items-center rounded-xl bg-black/[0.04] text-sm font-black transition hover:bg-black/[0.08]"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] sm:gap-2 sm:text-xs">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <b key={day} className="py-1 text-black/60">
              {day}
            </b>
          ))}

          {calendarDays.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="h-9" />;
            }

            const dateKey = formatDateKey(date);
            const hasEvent = Boolean(eventsByDate[dateKey]?.length);
            const isToday = isSameDate(date, today);

            return (
              <motion.button
                key={dateKey}
                type="button"
                whileTap={{ scale: hasEvent ? 0.92 : 1 }}
                onClick={() => {
                  if (hasEvent) {
                    setSelectedDate(date);
                  }
                }}
                className={[
                  "relative grid h-9 place-items-center rounded-full transition",
                  hasEvent
                    ? "bg-limey font-black text-ink shadow-sm hover:brightness-95"
                    : "bg-black/[0.03] text-ink hover:bg-black/[0.06]",
                  isToday ? "font-black ring-2 ring-ink/20" : "",
                  !hasEvent ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
                title={
                  hasEvent ? "Klik untuk lihat detail kegiatan" : undefined
                }
              >
                {date.getDate()}

                {hasEvent && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] font-black text-white">
                    {eventsByDate[dateKey].length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <EventDetailModal
        date={selectedDate}
        events={selectedEvents}
        onClose={() => setSelectedDate(null)}
      />
    </>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  const summary = data?.sarpras || {
    bagus: 0,
    rusak: 0,
    perlu_diperbaiki: 0,
  };

  const schedules = data?.schedules || [];

  const financeSummary = useMemo(() => {
    const chart = data?.finance_chart || [];
    const totalPemasukan = chart.reduce(
      (sum, item) => sum + (item.pemasukan || 0),
      0,
    );
    const totalPengeluaran = chart.reduce(
      (sum, item) => sum + (item.pengeluaran || 0),
      0,
    );
    const sisaSaldo = totalPemasukan - totalPengeluaran;
    return { totalPemasukan, totalPengeluaran, sisaSaldo };
  }, [data?.finance_chart]);

  const [hiddenCharts, setHiddenCharts] = useState([]);

  const handleLegendClick = (key) => {
    setHiddenCharts((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid w-full gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"
    >
      <section className="min-w-0 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={PackageCheck}
            title="Barang Bagus"
            value={summary.bagus}
            delay={0.05}
          />
          <StatCard
            icon={PackageX}
            title="Barang Rusak"
            value={summary.rusak}
            tone="bg-red-200"
            delay={0.1}
          />
          <StatCard
            icon={Wrench}
            title="Harus Diperbaiki"
            value={summary.perlu_diperbaiki}
            tone="bg-orange-200"
            delay={0.15}
          />
        </div>

        <motion.div
          variants={cardMotion}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.2 }}
          className="card p-4 sm:p-5"
        >
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-black text-ink">Chart Keuangan</h2>
            <span className="w-fit rounded-full bg-black/5 px-3 py-1 text-xs font-bold">
              Pemasukan vs Pengeluaran
            </span>
          </div>

          <div className="h-72 min-w-0 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.finance_chart || []}
                margin={{ left: -10, right: -1 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend
                  content={() => (
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleLegendClick("pemasukan")}
                        className="flex items-center gap-2"
                      >
                        <span className="h-3 w-3 bg-[#c6f432]" />
                        <span
                          style={{
                            color: "#000",
                            textDecoration: hiddenCharts.includes("pemasukan")
                              ? "line-through"
                              : "none",
                            opacity: hiddenCharts.includes("pemasukan")
                              ? 0.5
                              : 1,
                          }}
                        >
                          pemasukan
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLegendClick("pengeluaran")}
                        className="flex items-center gap-2"
                      >
                        <span className="h-3 w-3 bg-[#991B1B]" />
                        <span
                          style={{
                            color: "#000",
                            textDecoration: hiddenCharts.includes("pengeluaran")
                              ? "line-through"
                              : "none",
                            opacity: hiddenCharts.includes("pengeluaran")
                              ? 0.5
                              : 1,
                          }}
                        >
                          pengeluaran
                        </span>
                      </button>
                    </div>
                  )}
                />
                {!hiddenCharts.includes("pemasukan") && (
                  <Bar
                    dataKey="pemasukan"
                    fill="#c6f432"
                    radius={[6, 6, 0, 0]}
                  />
                )}

                {!hiddenCharts.includes("pengeluaran") && (
                  <Bar
                    dataKey="pengeluaran"
                    fill="#991B1B"
                    radius={[6, 6, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={cardMotion}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.25 }}
          className="card p-4 sm:p-5"
        >
          <h2 className="mb-4 font-black text-ink">Progress Renovasi</h2>

          <div className="space-y-4">
            {(data?.renovations || []).filter((item) => item.progress < 100)
              .length ? (
              data.renovations
                .filter((item) => item.progress < 100)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 * index }}
                    className="flex flex-col gap-3 rounded-2xl bg-black/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-bold text-ink">
                        {item.jenis_perbaikan}
                      </p>
                      <p className="text-xs text-black/50">
                        {formatTanggal(item.tanggal_perbaikan)}
                      </p>
                    </div>

                    <ProgressBar value={item.progress} />
                  </motion.div>
                ))
            ) : (
              <p className="rounded-2xl bg-black/[0.02] p-4 text-sm text-black/50">
                Belum ada data renovasi.
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <aside className="min-w-0 space-y-5">
        <motion.div
          variants={cardMotion}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.3 }}
          className={`card hidden p-5 text-black lg:block ${
            financeSummary.sisaSaldo >= 0 ? "bg-limey" : "bg-orange-600"
          }`}
        >
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-ink text-gray-50">
            <DollarSign size={20} />
          </div>
          <h3 className="text-xl font-black">Sisa Saldo</h3>
          <p className="text-2xl font-black">
            {money(financeSummary.sisaSaldo)}
          </p>
          <p className="mt-3 text-xs text-ink">
            Masuk: {money(financeSummary.totalPemasukan)}
          </p>
          <p className="text-xs text-ink">
            Keluar: {money(financeSummary.totalPengeluaran)}
          </p>
        </motion.div>

        <motion.div
          variants={cardMotion}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.35 }}
          className="card p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} />
            <h2 className="font-black text-ink">Schedule Kegiatan</h2>
          </div>

          <div className="space-y-3">
            {schedules.length ? (
              schedules.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.04 * index }}
                  className="rounded-2xl bg-black/[0.03] p-4"
                >
                  <p className="break-words font-bold text-ink">
                    {item.kegiatan_dkm}
                  </p>
                  <p className="text-xs text-black/50">
                    {item.tanggal_kegiatan} • {item.waktu_kegiatan}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="rounded-2xl bg-black/[0.03] p-4 text-sm text-black/50">
                Belum ada kegiatan.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={cardMotion}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.4 }}
        >
          <RealCalendar schedules={schedules} />
        </motion.div>
      </aside>
    </motion.div>
  );
}
