import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

export default function ResourceFormModal({
  open,
  title,
  fields = [],
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const base = Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""]),
    );

    setForm({
      ...base,
      ...(initialData || {}),
      user_id: initialData?.user_id ?? 1,
    });
  }, [fields, initialData, open]);

  const visibleFields = fields.filter((field) => field.name !== "user_id");

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      ...form,
      user_id: form.user_id ?? 1,
    });

    onClose();
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {visibleFields.map((field) => {
          const value = form[field.name] ?? "";

          return (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm font-bold text-ink">
                {field.label}
              </span>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  required={field.required}
                  className="input"
                >
                  <option value="">Pilih {field.label}</option>

                  {field.options?.map((option) => {
                    const optionValue =
                      typeof option === "object" ? option.value : option;
                    const optionLabel =
                      typeof option === "object" ? option.label : option;

                    return (
                      <option key={optionValue} value={optionValue}>
                        {optionLabel}
                      </option>
                    );
                  })}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  required={field.required}
                  rows={4}
                  className="input min-h-28 resize-y"
                  placeholder={field.placeholder || field.label}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="input"
                  placeholder={field.placeholder || field.label}
                />
              )}
            </label>
          );
        })}

        <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">
            Batal
          </button>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}