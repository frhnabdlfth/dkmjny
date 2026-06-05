import ResourcePage from "../ResourcePage";

export default function ProkerPage() {
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const formatWaktu = (waktu) => {
    if (!waktu) return "-";

    return waktu.slice(0, 5);
  };

  return (
    <ResourcePage
      title="Proker DKM"
      subtitle="Program kerja dan kegiatan masjid."
      path="/proker-dkm"
      labelKey="kegiatan_dkm"
      columns={[
        { key: "kegiatan_dkm", label: "Kegiatan" },
        { key: "waktu_kegiatan", label: "Waktu Kegiatan", render: (r) => formatWaktu(r.waktu_kegiatan) },
        {
          key: "tanggal_kegiatan",
          label: "Tanggal Kegiatan",
          render: (r) => formatTanggal(r.tanggal_kegiatan),
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
        { name: "kegiatan_dkm", label: "Kegiatan", required: true },
        {
          name: "waktu_kegiatan",
          label: "Waktu Kegiatan",
          type: "time",
          required: true,
        },
        {
          name: "tanggal_kegiatan",
          label: "Tanggal Kegiatan",
          type: "date",
          required: true,
        },
      ]}
    />
  );
}
