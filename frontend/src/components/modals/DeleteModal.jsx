import Modal from "../ui/Modal";

export default function DeleteModal({
  open,
  title = "Hapus Data",
  label,
  onClose,
  onConfirm,
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="mb-3 text-xl text-red-800">
        Yakin mau menghapus <b className="text-ink">{label}</b>?
      </p>
      <p className="mb-3 text-sm text-black/60">
        Data yang dihapus tidak bisa dikembalikan.
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button className="btn-ghost w-full sm:w-auto" onClick={onClose}>
          Batal
        </button>
        <button className="btn-red bold w-full sm:w-auto" onClick={onConfirm}>
          Hapus
        </button>
      </div>
    </Modal>
  );
}
