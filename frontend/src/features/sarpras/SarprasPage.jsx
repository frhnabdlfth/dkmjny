import { useState } from "react";
import ResourcePage from "../ResourcePage";

export default function SarprasPage() {
  const [previewFoto, setPreviewFoto] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");

  const getImageUrl = (file) => {
    if (!file) return null;
    if (file.startsWith("http")) return file;

    const cleaned = file
      .replace(/^storage\//, "")
      .replace(/^image\//, "")
      .replace(/^\//, "");

    return `http://localhost:8000/storage/image/${cleaned}`;
  };

  const kondisiBadge = {
    Bagus: "bg-green-100 text-green-800",
    Rusak: "bg-red-100 text-red-800",
    "Perlu Diperbaiki": "bg-amber-100 text-amber-800",
  };

  return (
    <>
      <ResourcePage
        title="Sarpras"
        subtitle="Inventaris barang dan kondisi barang masjid."
        path="/sarpras"
        labelKey="barang"
        enableSearch
        searchFields={["barang", "kondisi"]}
        enableFilter
        filterField="kondisi"
        filterOptions={[
          {
            label: "Kondisi",
            options: [
              { label: "Rusak", value: "Rusak" },
              { label: "Bagus", value: "Bagus" },
              { label: "Perlu Diperbaiki", value: "Perlu Diperbaiki" },
            ],
          },
        ]}
        columns={[
          { key: "barang", label: "Barang" },
          {
            key: "kondisi",
            label: "Kondisi Barang",
            render: (r) => (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${kondisiBadge[r.kondisi] ?? "bg-black/5 text-black"}`}
              >
                {r.kondisi}
              </span>
            ),
          },
          {
            key: "foto",
            label: "Foto",
            render: (r) =>
              r.foto ? (
                <img
                  src={getImageUrl(r.foto)}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                  onClick={() => setPreviewFoto(getImageUrl(r.foto))}
                  className="h-12 w-12 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ) : (
                "—"
              ),
          },
        ]}
        fields={[
          {
            name: "user_id",
            label: "User ID",
            type: "number",
            defaultValue: 1,
            required: true,
          },
          { name: "barang", label: "Nama Barang", required: true },
          {
            name: "kondisi",
            label: "Jenis Kondisi Barang",
            type: "select",
            options: ["Bagus", "Rusak", "Perlu Diperbaiki"],
            required: true,
          },
          {
            name: "foto",
            label: "Foto Barang",
            type: "file",
            required: false,
          },
        ]}
      />

      {previewFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setPreviewFoto(null)}
        >
          <div
            className="relative bg-white rounded-xl p-4 max-w-md w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewFoto(null)}
              className="absolute top-3 right-3 text-black/40 hover:text-black/70"
            >
              ✕
            </button>
            <p className="text-sm font-bold mb-3">Preview Foto</p>
            <img
              src={previewFoto}
              className="w-full rounded-lg object-contain max-h-80"
            />
          </div>
        </div>
      )}
    </>
  );
}
