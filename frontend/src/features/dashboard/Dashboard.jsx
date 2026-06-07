import { memo, useCallback, useEffect, useMemo, useState } from "react";
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

const EMPTY_ARRAY = [];
const EMPTY_SARPRAS = { bagus: 0, rusak: 0, perlu_diperbaiki: 0 };
const EMPTY_FINANCE = { totalPemasukan: 0, totalPengeluaran: 0, sisaSaldo: 0 };

const dashboardCache = { data: null, ts: 0 };
const CACHE_TTL_MS = 60_000;

const money = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v || 0);

const formatYAxis = (value) => {
  if (!value) return "Rp 0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000) {
    return `${sign}Rp ${+(abs / 1_000_000_000_000).toFixed(1)} T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}Rp ${+(abs / 1_000_000_000).toFixed(1)} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp ${+(abs / 1_000_000).toFixed(1)} Jt`;
  }
  if (abs >= 1_000) {
    return `${sign}Rp ${+(abs / 1_000).toFixed(1)} Rb`;
  }
  return `${sign}Rp ${new Intl.NumberFormat("id-ID").format(abs)}`;
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

const isSameDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function buildCalendarDays(activeDate) {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = memo(function StatCard({
  icon: Icon,
  title,
  value,
  tone = "bg-limey",
  delay = 0,
}) {
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
});

// ─── EventDetailModal ─────────────────────────────────────────────────────────
const EventDetailModal = memo(function EventDetailModal({
  date,
  events,
  onClose,
}) {
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
          onMouseDown={(e) => e.stopPropagation()}
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
                  {formatTanggal(event.tanggal_kegiatan)} •{" "}
                  {event.waktu_kegiatan}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

// ─── CalendarDay ──────────────────────────────────────────────────────────────
const CalendarDay = memo(function CalendarDay({
  date,
  dateKey,
  hasEvent,
  eventCount,
  isToday,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    if (hasEvent) onSelect(date);
  }, [hasEvent, date, onSelect]);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: hasEvent ? 0.92 : 1 }}
      onClick={handleClick}
      className={[
        "relative grid h-9 place-items-center rounded-full transition",
        hasEvent
          ? "bg-limey font-black text-ink shadow-sm hover:brightness-95 cursor-pointer"
          : "bg-black/[0.03] text-ink hover:bg-black/[0.06] cursor-default",
        isToday ? "font-black ring-2 ring-ink/20" : "",
      ].join(" ")}
      title={hasEvent ? "Klik untuk lihat detail kegiatan" : undefined}
    >
      {date.getDate()}
      {hasEvent && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] font-black text-white">
          {eventCount}
        </span>
      )}
    </motion.button>
  );
});

// ─── RealCalendar ─────────────────────────────────────────────────────────────
const RealCalendar = memo(function RealCalendar({ schedules = EMPTY_ARRAY }) {
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
      if (!acc[item.tanggal_kegiatan]) acc[item.tanggal_kegiatan] = [];
      acc[item.tanggal_kegiatan].push(item);
      return acc;
    }, {});
  }, [schedules]);

  const selectedEvents = useMemo(
    () =>
      selectedDate
        ? (eventsByDate[formatDateKey(selectedDate)] ?? EMPTY_ARRAY)
        : EMPTY_ARRAY,
    [selectedDate, eventsByDate],
  );

  const goToPrev = useCallback(
    () => setActiveDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)),
    [],
  );

  const goToNext = useCallback(
    () => setActiveDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)),
    [],
  );

  const handleSelectDate = useCallback((date) => setSelectedDate(date), []);
  const closeModal = useCallback(() => setSelectedDate(null), []);

  return (
    <>
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.35, delay: 0.2 }}
        className="card p-5"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-ink">Kalender Pengingat</h2>
            <p className="text-xs text-black/40">{getMonthLabel(activeDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrev}
              className="grid h-8 w-8 place-items-center rounded-xl bg-black/[0.04] text-sm font-black transition hover:bg-black/[0.08]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNext}
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
            if (!date) return <span key={`empty-${index}`} className="h-9" />;
            const dateKey = formatDateKey(date);
            const eventsOnDay = eventsByDate[dateKey];
            const hasEvent = Boolean(eventsOnDay?.length);
            return (
              <CalendarDay
                key={dateKey}
                date={date}
                dateKey={dateKey}
                hasEvent={hasEvent}
                eventCount={eventsOnDay?.length ?? 0}
                isToday={isSameDate(date, today)}
                onSelect={handleSelectDate}
              />
            );
          })}
        </div>
      </motion.div>

      <EventDetailModal
        date={selectedDate}
        events={selectedEvents}
        onClose={closeModal}
      />
    </>
  );
});

// ─── FinanceChart ─────────────────────────────────────────────────────────────
const LEGEND_KEYS = [
  { key: "pemasukan", color: "#c6f432" },
  { key: "pengeluaran", color: "#991B1B" },
];

const FinanceChart = memo(function FinanceChart({ chartData }) {
  const [hiddenCharts, setHiddenCharts] = useState([]);

  const handleLegendClick = useCallback((key) => {
    setHiddenCharts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  return (
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
        <ResponsiveContainer width="99%" height="99%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="tanggal"
              tickFormatter={formatTanggal}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatYAxis}
              width={80}
            />
            <Tooltip
              formatter={(value, name) => [money(value), name]}
              labelFormatter={formatTanggal}
              labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
            />
            <Legend
              content={() => (
                <div className="mt-4 flex items-center justify-center gap-4">
                  {LEGEND_KEYS.map(({ key, color }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleLegendClick(key)}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-3 w-3"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        style={{
                          color: "#000",
                          textDecoration: hiddenCharts.includes(key)
                            ? "line-through"
                            : "none",
                          opacity: hiddenCharts.includes(key) ? 0.5 : 1,
                        }}
                      >
                        {key}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
            {!hiddenCharts.includes("pemasukan") && (
              <Bar dataKey="pemasukan" fill="#c6f432" radius={[6, 6, 0, 0]} />
            )}
            {!hiddenCharts.includes("pengeluaran") && (
              <Bar dataKey="pengeluaran" fill="#991B1B" radius={[6, 6, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

// ─── RenovationList ───────────────────────────────────────────────────────────
const RenovationList = memo(function RenovationList({ renovations }) {
  const active = useMemo(
    () => renovations.filter((item) => item.progress < 100),
    [renovations],
  );

  return (
    <motion.div
      variants={cardMotion}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, delay: 0.25 }}
      className="card p-4 sm:p-5"
    >
      <h2 className="mb-4 font-black text-ink">Progress Renovasi</h2>
      <div className="space-y-4">
        {active.length ? (
          active.map((item, index) => (
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
  );
});

// ─── ScheduleList ─────────────────────────────────────────────────────────────
const ScheduleList = memo(function ScheduleList({ schedules }) {
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const sorted = useMemo(() => {
    return [...schedules].sort((a, b) => {
      const diffA = new Date(a.tanggal_kegiatan) - todayStart;
      const diffB = new Date(b.tanggal_kegiatan) - todayStart;
      const futureA = diffA >= 0;
      const futureB = diffB >= 0;
      if (futureA && futureB) return diffA - diffB;
      if (!futureA && !futureB) return diffB - diffA;
      return futureA ? -1 : 1;
    });
  }, [schedules, todayStart]);

  const nearestId = useMemo(
    () =>
      sorted.find((item) => new Date(item.tanggal_kegiatan) >= todayStart)
        ?.id ?? null,
    [sorted, todayStart],
  );

  return (
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
        {sorted.length ? (
          sorted.map((item, index) => {
            const isUpcoming = new Date(item.tanggal_kegiatan) >= todayStart;
            const isNearest = item.id === nearestId;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.04 * index }}
                className={`rounded-2xl p-4 ${
                  isUpcoming ? "bg-gray-50" : "bg-black/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="break-words font-bold text-ink">
                    {item.kegiatan_dkm}
                  </p>
                  {isNearest && (
                    <span className="shrink-0 rounded-full bg-limey px-2.5 py-0.5 text-[10px] font-black text-ink">
                      Terdekat
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  {isUpcoming && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                  )}
                  <p className="text-xs text-black/50">
                    {formatTanggal(item.tanggal_kegiatan)} •{" "}
                    {item.waktu_kegiatan}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="rounded-2xl bg-black/[0.03] p-4 text-sm text-black/50">
            Belum ada kegiatan.
          </p>
        )}
      </div>
    </motion.div>
  );
});

// ─── SaldoCard ────────────────────────────────────────────────────────────────
const SaldoCard = memo(function SaldoCard({ financeSummary }) {
  return (
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
      <p className="text-2xl font-black">{money(financeSummary.sisaSaldo)}</p>
      <p className="mt-3 text-xs text-ink">
        Masuk: {money(financeSummary.totalPemasukan)}
      </p>
      <p className="text-xs text-ink">
        Keluar: {money(financeSummary.totalPengeluaran)}
      </p>
    </motion.div>
  );
});

// ─── Dashboard (root) ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (
        dashboardCache.data &&
        Date.now() - dashboardCache.ts < CACHE_TTL_MS
      ) {
        setData(dashboardCache.data);
        return;
      }

      try {
        const res = await api.get("/dashboard", { signal: controller.signal });
        dashboardCache.data = res.data;
        dashboardCache.ts = Date.now();
        setData(res.data);
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setData(null);
        }
      }
    };

    load();

    return () => controller.abort();
  }, []);

  const summary = data?.sarpras ?? EMPTY_SARPRAS;
  const schedules = data?.schedules ?? EMPTY_ARRAY;
  const renovations = data?.renovations ?? EMPTY_ARRAY;
  const chartData = data?.finance_chart ?? EMPTY_ARRAY;

  const financeSummary = useMemo(() => {
    if (!chartData.length) return EMPTY_FINANCE;
    const totalPemasukan = chartData.reduce(
      (s, i) => s + (i.pemasukan || 0),
      0,
    );
    const totalPengeluaran = chartData.reduce(
      (s, i) => s + (i.pengeluaran || 0),
      0,
    );
    return {
      totalPemasukan,
      totalPengeluaran,
      sisaSaldo: totalPemasukan - totalPengeluaran,
    };
  }, [chartData]);

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

        <FinanceChart chartData={chartData} />
        <RenovationList renovations={renovations} />
      </section>

      <aside className="min-w-0 space-y-5">
        <SaldoCard financeSummary={financeSummary} />
        <ScheduleList schedules={schedules} />
        <RealCalendar schedules={schedules} />
      </aside>
    </motion.div>
  );
}
