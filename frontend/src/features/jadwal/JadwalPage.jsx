import ResourcePage from "../ResourcePage";

const kategori = ["5 Waktu", "Jumatan", "Idul Fitri", "Idul Adha"];
export default function JadwalPage() {
  return (
    <ResourcePage
      title="Jadwal DKM"
      subtitle="Kelola jadwal imam, khatib, dan muadzin."
      path="/jadwal-dkm"
      labelKey="imam"
      columns={[
        { key: "imam", label: "Imam" },
        { key: "kategori_imam", label: "Kategori Imam" },
        { key: "khatib", label: "Khatib" },
        { key: "kategori_khatib", label: "Kategori Khatib" },
        { key: "muadzin", label: "Muadzin" },
        { key: "kategori_muadzin", label: "Kategori Muadzin" },
      ]}
      fields={[
        {
          name: "user_id",
          label: "User ID",
          type: "number",
          defaultValue: 1,
          required: true,
        },
        { name: "imam", label: "Imam", required: true },
        {
          name: "kategori_imam",
          label: "Kategori Imam",
          type: "select",
          options: kategori,
          required: true,
        },
        { name: "khatib", label: "Khatib" },
        {
          name: "kategori_khatib",
          label: "Kategori Khatib",
          type: "select",
          options: kategori,
        },
        { name: "muadzin", label: "Muadzin" },
        {
          name: "kategori_muadzin",
          label: "Kategori Muadzin",
          type: "select",
          options: kategori,
        },
      ]}
    />
  );
}
