import { useEffect, useState, memo } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import DatePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";

const ResourceFormModal = memo(function ResourceFormModal({
  open,
  title,
  fields = [],
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const base = Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""]),
    );

    const merged = {
      ...base,
      user_id: initialData?.user_id ?? 1,
    };

    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        const value = initialData[key];
        merged[key] =
          value !== null && value !== undefined ? value : (merged[key] ?? "");
      });
    }

    setForm(merged);
  }, [fields, initialData, open]);

  const visibleFields = fields.filter(
    (field) => field.name !== "user_id" && !field.hidden,
  );

  const formatRupiah = (value) => {
    if (!value) return "";

    const numberString = value.toString().replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  };

  const parseRupiah = (value) => {
    return value.replace(/\./g, "").replace(/,/g, "");
  };

  const handleChange = (event) => {
    const { name, value, dataset, type, files } = event.target;

    if (dataset.type === "currency") {
      setForm((prev) => ({
        ...prev,
        [name]: parseRupiah(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const hasFile = fields.some((f) => f.type === "file");

      if (hasFile) {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          const isFileField =
            fields.find((f) => f.name === key)?.type === "file";

          if (isFileField && !(value instanceof File)) return;

          formData.append(key, value);
        });

        await onSubmit(formData);
      } else {
        await onSubmit(form);
      }

      toast.success(
        initialData ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
      );

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Gagal menyimpan data",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={submitting || loading ? undefined : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {visibleFields.map((field) => {
          const value = form[field.name] ?? "";

          return (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm font-bold text-ink">
                {field.label}
              </span>

              {field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  onChange={handleChange}
                  className="input"
                  required={field.required}
                />
              ) : field.type === "select" ? (
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
              ) : field.type === "date" ? (
                <DatePicker
                  value={value}
                  required={field.required}
                  placeholder={field.placeholder || field.label}
                  onChange={(selectedDate) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.name]: selectedDate,
                    }))
                  }
                />
              ) : field.type === "time" ? (
                <div className="w-full">
                  <TimePicker
                    value={value}
                    onChange={(selectedTime) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: selectedTime,
                      }))
                    }
                  />
                </div>
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
                  type={field.type === "number" ? "text" : field.type || "text"}
                  name={field.name}
                  value={field.type === "number" ? formatRupiah(value) : value}
                  onChange={handleChange}
                  data-type={field.type === "number" ? "currency" : undefined}
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
          <button
            type="button"
            onClick={onClose}
            disabled={submitting || loading}
            className="btn-ghost"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={submitting || loading}
            className="btn-primary"
          >
            {submitting || loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
});

export default ResourceFormModal;
