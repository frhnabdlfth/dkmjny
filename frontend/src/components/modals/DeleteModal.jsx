import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";

export default function DeleteModal({
  open,
  title = "Hapus Data",
  label,
  onClose,
  onConfirm,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await onConfirm();

      toast.success("Data berhasil dihapus");

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Gagal menghapus data",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title={title} onClose={submitting ? undefined : onClose}>
      <p className="mb-1 text-xl text-ink">
        Yakin mau menghapus <span className="font-bold">{label}</span>?
      </p>
      <p className="mb-3 text-sm text-black/60">
        Data yang dihapus tidak bisa dikembalikan.
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          className="btn-ghost w-full sm:w-auto"
          onClick={onClose}
          disabled={submitting}
        >
          Batal
        </button>
        <button
          className="btn-red bold w-full sm:w-auto"
          onClick={handleDelete}
          disabled={submitting}
        >
          {submitting ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </Modal>
  );
}
