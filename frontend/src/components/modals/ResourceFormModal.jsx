import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

export default function ResourceFormModal({
  open,
  title,
  fields,
  initialData,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({});
  useEffect(() => {
    const base = Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""]),
    );
    setForm({ ...base, ...(initialData || {}) });
  }, [fields, initialData, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    onClose();
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className={field.full ? "sm:col-span-2" : ""}>
            <span className="label mb-1 block">{field.label}</span>
            {field.type === "select" ? (
              <select
                className="input"
                value={form[field.name] ?? ""}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                required={field.required}
              >
                <option value="">Pilih</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                type={field.type || "text"}
                value={form[field.name] ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [field.name]:
                      field.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                required={field.required}
                min={field.min}
                max={field.max}
              />
            )}
          </label>
        ))}
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button className="btn-primary">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}
