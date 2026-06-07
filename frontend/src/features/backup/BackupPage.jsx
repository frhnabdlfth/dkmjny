import { useState } from "react";
import { Trash2, Download } from "lucide-react";
import { useCrud } from "../../hooks/useCrud";
import { api } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import PageTitle from "../../components/ui/PageTitle";
import DeleteModal from "../../components/modals/DeleteModal";

export default function BackupPage() {
  const { items, loading, fetchItems, removeItem } = useCrud("/backup");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const backup = async () => {
    await api.post("/backup");
    await fetchItems();
  };

  const openDelete = (row) => {
    setSelected(row);
    setDeleteOpen(true);
  };

  const downloadBackup = async (row) => {
    try {
      setDownloading(row.id);
      const response = await api.get(`/backup/${row.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `backup_${row.db}_${row.tanggal}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download gagal:", error);
    } finally {
      setDownloading(null);
    }
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
          {
            key: "tanggal",
            label: "Tanggal Backup",
            render: (r) => formatTanggal(r.tanggal),
          },
        ]}
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button
              title="Download backup"
              disabled={downloading === row.id}
              className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
              onClick={() => downloadBackup(row)}
            >
              <Download size={16} />
            </button>
            <button
              title="Hapus backup"
              className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
              onClick={() => openDelete(row)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />
      <DeleteModal
        open={deleteOpen}
        label={`Backup ${selected?.db} - ${formatTanggal(selected?.tanggal)}`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await removeItem(selected.id);
          setDeleteOpen(false);
        }}
      />
    </>
  );
}
