import { useState, useMemo, useRef } from "react";
import ResourcePage from "../ResourcePage";
import Modal from "../../components/ui/Modal";

const jenisPemasukan = ["Amal", "Sedekah", "Infaq", "Lainnya"];
const jenisPengeluaran = ["Jasa", "Belanja", "Renovasi", "Lainnya"];
const money = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v || 0);

function SummaryCard({ title, amount, color }) {
  return (
    <div className={`${color} rounded-xl p-4 sm:p-6 text-white`}>
      <p className="text-xs sm:text-sm font-medium opacity-90">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-2">{money(amount)}</p>
    </div>
  );
}

export default function KeuanganPage() {
  const [tipeTransaksi, setTipeTransaksi] = useState("");
  const [typeSelectionOpen, setTypeSelectionOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const resourcePageRef = useRef(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const columns = useMemo(
    () => [
      {
        key: "tanggal",
        label: "Tanggal",
        render: (r) => formatTanggal(r.tanggal),
      },
      {
        key: "pemasukan",
        label: "Pemasukan",
        render: (r) => money(r.pemasukan),
      },
      {
        key: "pengeluaran",
        label: "Pengeluaran",
        render: (r) => money(r.pengeluaran),
      },
      {
        key: "jenis",
        label: "Jenis Transaksi",
        render: (r) => r.jenis_pemasukan || r.jenis_pengeluaran || "-",
      },
      {
        key: "deskripsi",
        label: "Deskripsi Keuangan",
        render: (r) => r.deskripsi || "-",
      },
    ],
    [],
  );

  const viewColumns = useMemo(() => {
    const baseColumns = [
      {
        key: "tanggal",
        label: "Tanggal",
        render: (r) => formatTanggal(r.tanggal),
      },
      {
        key: "pemasukan",
        label: "Pemasukan",
        render: (r) => money(r.pemasukan),
      },
      {
        key: "pengeluaran",
        label: "Pengeluaran",
        render: (r) => money(r.pengeluaran),
      },
    ];

    if (tipeTransaksi === "Pemasukan") {
      baseColumns.push({
        key: "jenis_pemasukan",
        label: "Jenis Pemasukan",
        render: (r) => r.jenis_pemasukan || "-",
      });
    } else if (tipeTransaksi === "Pengeluaran") {
      baseColumns.push({
        key: "jenis_pengeluaran",
        label: "Jenis Pengeluaran",
        render: (r) => r.jenis_pengeluaran || "-",
      });
    }

    baseColumns.push({
      key: "deskripsi",
      label: "Deskripsi Keuangan",
      render: (r) => r.deskripsi || "-",
    });

    return baseColumns;
  }, [tipeTransaksi]);

  const fields = useMemo(() => {
    if (tipeTransaksi === "Pemasukan") {
      return [
        {
          name: "user_id",
          label: "User ID",
          type: "number",
          defaultValue: 1,
          required: true,
        },
        {
          name: "pemasukan",
          label: "Pemasukan",
          type: "number",
          defaultValue: 0,
          required: true,
        },
        {
          name: "jenis_pemasukan",
          label: "Jenis",
          type: "select",
          options: jenisPemasukan,
          defaultValue: "",
        },
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "deskripsi", label: "Deskripsi", required: false },
        {
          name: "pengeluaran",
          label: "Pengeluaran",
          type: "number",
          defaultValue: 0,
          hidden: true,
        },
        {
          name: "jenis_pengeluaran",
          label: "Jenis Pengeluaran",
          defaultValue: "",
          hidden: true,
        },
      ];
    } else if (tipeTransaksi === "Pengeluaran") {
      return [
        {
          name: "user_id",
          label: "User ID",
          type: "number",
          defaultValue: 1,
          required: true,
        },
        {
          name: "pengeluaran",
          label: "Pengeluaran",
          type: "number",
          defaultValue: 0,
          required: true,
        },
        {
          name: "jenis_pengeluaran",
          label: "Jenis",
          type: "select",
          options: jenisPengeluaran,
          defaultValue: "",
        },
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "deskripsi", label: "Deskripsi", required: false },
        {
          name: "pemasukan",
          label: "Pemasukan",
          type: "number",
          defaultValue: 0,
          hidden: true,
        },
        {
          name: "jenis_pemasukan",
          label: "Jenis Pemasukan",
          defaultValue: "",
          hidden: true,
        },
      ];
    }
    return [];
  }, [tipeTransaksi]);

  const renderHeader = (items) => {
    const totalPemasukan = items.reduce(
      (sum, item) => sum + (item.pemasukan || 0),
      0,
    );
    const totalPengeluaran = items.reduce(
      (sum, item) => sum + (item.pengeluaran || 0),
      0,
    );
    const sisaSaldo = totalPemasukan - totalPengeluaran;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <SummaryCard
          title="Saldo Pemasukan"
          amount={totalPemasukan}
          color="bg-green-700"
        />
        <SummaryCard
          title="Saldo Pengeluaran"
          amount={totalPengeluaran}
          color="bg-red-800"
        />
        <SummaryCard
          title="Sisa Saldo"
          amount={sisaSaldo}
          color={sisaSaldo >= 0 ? "bg-blue-500" : "bg-orange-500"}
        />
      </div>
    );
  };

  const handleBeforeCreate = () => {
    setTypeSelectionOpen(true);
  };

  const handleBeforeEdit = (row) => {
    setEditData(row);
    const type =
      row.jenis_pemasukan && row.jenis_pemasukan.trim() !== ""
        ? "Pemasukan"
        : "Pengeluaran";
    setTipeTransaksi(type);

    if (resourcePageRef.current?.openForm) {
      setTimeout(() => {
        resourcePageRef.current.openForm(row);
      }, 0);
    }
  };

  const handleBeforeView = (row) => {
    const type =
      row.jenis_pemasukan && row.jenis_pemasukan.trim() !== ""
        ? "Pemasukan"
        : "Pengeluaran";
    setTipeTransaksi(type);

    if (resourcePageRef.current?.openView) {
      setTimeout(() => {
        resourcePageRef.current.openView(row);
      }, 0);
    }
  };

  const handleTypeSelected = (type) => {
    setTipeTransaksi(type);
    setTypeSelectionOpen(false);
    if (resourcePageRef.current?.openForm) {
      setTimeout(() => {
        resourcePageRef.current.openForm();
      }, 0);
    }
  };

  return (
    <>
      <ResourcePage
        ref={resourcePageRef}
        title="Keuangan"
        subtitle="Kelola pemasukan dan pengeluaran."
        path="/keuangan"
        labelKey="jenis_pengeluaran"
        canView
        enableSearch
        searchFields={["deskripsi", "jenis_pemasukan", "jenis_pengeluaran"]}
        enableFilter
        filterOptions={[
          {
            label: "Pemasukan",
            options: [
              { label: "Amal", value: "Amal" },
              { label: "Sedekah", value: "Sedekah" },
              { label: "Infaq", value: "Infaq" },
              { label: "Lainnya", value: "Lainnya" },
            ],
          },
          {
            label: "Pengeluaran",
            options: [
              { label: "Jasa", value: "Jasa" },
              { label: "Belanja", value: "Belanja" },
              { label: "Renovasi", value: "Renovasi" },
              { label: "Lainnya", value: "Lainnya" },
            ],
          },
        ]}
        enableSort
        sortField="tanggal"
        columns={columns}
        viewColumns={viewColumns}
        fields={fields}
        onBeforeCreate={handleBeforeCreate}
        onBeforeEdit={handleBeforeEdit}
        onBeforeView={handleBeforeView}
        renderHeader={renderHeader}
        tipeTransaksi={tipeTransaksi}
      />
      <Modal
        open={typeSelectionOpen}
        title="Pilih Jenis Transaksi"
        onClose={() => setTypeSelectionOpen(false)}
      >
        <div className="space-y-3">
          <button
            onClick={() => handleTypeSelected("Pemasukan")}
            className="w-full btn-primary py-3"
          >
            Pemasukan
          </button>
          <button
            onClick={() => handleTypeSelected("Pengeluaran")}
            className="w-full btn-secondary py-3"
          >
            Pengeluaran
          </button>
        </div>
      </Modal>
    </>
  );
}
