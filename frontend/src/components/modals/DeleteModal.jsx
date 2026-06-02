import Modal from '../ui/Modal'

export default function DeleteModal({ open, title = 'Hapus Data', label, onClose, onConfirm }) {
  return <Modal open={open} title={title} onClose={onClose}>
    <p className="mb-6 text-sm text-black/60">Yakin mau menghapus <b className="text-ink">{label}</b>? Data yang dihapus tidak bisa dikembalikan.</p>
    <div className="flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Batal</button><button className="btn-dark" onClick={onConfirm}>Hapus</button></div>
  </Modal>
}
