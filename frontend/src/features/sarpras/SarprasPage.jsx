import ResourcePage from "../ResourcePage";

export default function SarprasPage() {
  return (
    <ResourcePage
      title="Sarpras"
      subtitle="Inventaris barang dan kondisi barang masjid."
      path="/sarpras"
      labelKey="barang"
      columns={[
        { key: "barang", label: "Barang" },
        {
          key: "kondisi",
          label: "Kondisi Barang",
          render: (r) => (
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold">
              {r.kondisi}
            </span>
          ),
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
        { name: "barang", label: "Nama Barang", required: true },
        {
          name: "kondisi",
          label: "Jenis Kondisi Barang",
          type: "select",
          options: ["Bagus", "Rusak", "Perlu Diperbaiki"],
          required: true,
        },
      ]}
    />
  );
}
