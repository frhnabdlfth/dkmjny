import Modal from "../ui/Modal";

export default function ViewModal({ open, title, data, fields, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="rounded-2xl bg-white p-4">
            <p className="label">{field.label}</p>
            <p className="mt-1 font-bold text-ink">
              {field.render ? field.render(data || {}) : data?.[field.key]}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
