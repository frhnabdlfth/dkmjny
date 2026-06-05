import ResourcePage from "../ResourcePage";

const kategori = ["5 Waktu", "Jumatan", "Idul Fitri", "Idul Adha"];
export default function JadwalPage() {
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const renderNullableBadge = (value) => {
    if (value === null || value === undefined || value === "") {
      return (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
          Tidak Ada
        </span>
      );
    }

    return value;
  };

  return (
    <ResourcePage
      title="Jadwal DKM"
      subtitle="Kelola jadwal imam, khatib, dan muadzin."
      path="/jadwal-dkm"
      labelKey="imam"
      columns={[
        {
          key: "tanggal",
          label: "tanggal",
          render: (r) => formatTanggal(r.tanggal),
        },
        { key: "imam", label: "Imam" },
        { key: "kategori_imam", label: "Kategori Imam" },
        {
          key: "khatib",
          label: "Khatib",
          render: (r) => renderNullableBadge(r.khatib),
        },
        {
          key: "kategori_khatib",
          label: "Kategori Khatib",
          render: (r) => renderNullableBadge(r.kategori_khatib),
        },
        {
          key: "muadzin",
          label: "Muadzin",
          render: (r) => renderNullableBadge(r.muadzin),
        },
        {
          key: "kategori_muadzin",
          label: "Kategori Muadzin",
          render: (r) => renderNullableBadge(r.kategori_muadzin),
        },
      ]}
      fields={[
        {
          name: "user_id",
          label: "User ID",
          type: "number",
          defaultValue: 1,
          required: true,
        },
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "imam", label: "Imam", required: true },
        {
          name: "kategori_imam",
          label: "Kategori Imam",
          type: "select",
          options: kategori,
          required: true,
        },
        { name: "khatib", label: "Khatib", required: false },
        {
          name: "kategori_khatib",
          label: "Kategori Khatib",
          type: "select",
          options: kategori,
          required: false,
        },
        { name: "muadzin", label: "Muadzin", required: false },
        {
          name: "kategori_muadzin",
          label: "Kategori Muadzin",
          type: "select",
          options: kategori,
          required: false,
        },
      ]}
    />
  );
}
