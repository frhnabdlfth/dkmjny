import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] bg-soft p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-ink">{title}</h3>
          <button className="btn-ghost !rounded-full !p-2" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
