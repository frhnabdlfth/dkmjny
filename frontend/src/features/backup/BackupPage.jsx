import { useCrud } from "../../hooks/useCrud";
import { api } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import PageTitle from "../../components/ui/PageTitle";

export default function BackupPage() {
  const { items, loading, fetchItems, removeItem } = useCrud("/backup");
  const backup = async () => {
    await api.post("/backup");
    await fetchItems();
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
    <>
      <PageTitle
        title="Backup"
        subtitle="Backup database dan hapus file backup lama."
        action={
          <button className="btn-primary" onClick={backup}>
            Backup Sekarang
          </button>
        }
      />
      <DataTable
        loading={loading}
        data={items}
        columns={[
          { key: "db", label: "Nama DB" },
          { key: "tanggal", label: "Tanggal Backup", render: (r) => formatTanggal(r.tanggal) },
        ]}
        actions={(row) => (
          <button className="btn-dark !py-2" onClick={() => removeItem(row.id)}>
            Hapus Backup
          </button>
        )}
      />
    </>
  );
}
