import { Plus, Eye, SquarePen, Trash2 } from "lucide-react";

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import PageTitle from "../components/ui/PageTitle";
import DataTable from "../components/ui/DataTable";
import ResourceFormModal from "../components/modals/ResourceFormModal";
import DeleteModal from "../components/modals/DeleteModal";
import ViewModal from "../components/modals/ViewModal";
import { useCrud } from "../hooks/useCrud";

const ResourcePage = forwardRef(function ResourcePage(
  {
    title,
    subtitle,
    path,
    columns,
    fields,
    labelKey,
    canView = false,
    onBackClick,
    tipeTransaksi,
    onBeforeCreate,
    onBeforeEdit,
    onBeforeView,
    viewColumns,
    renderHeader,
  },
  ref,
) {
  const { items, loading, createItem, updateItem, removeItem } = useCrud(path);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useImperativeHandle(ref, () => ({
    openForm: (data = null) => {
      setSelected(data);
      setFormOpen(true);
    },
    openView: (data = null) => {
      setSelected(data);
      setViewOpen(true);
    },
  }));

  const viewFields = useMemo(
    () =>
      (viewColumns || columns).map((col) => ({
        key: col.key,
        label: col.label,
        render: col.render,
      })),
    [columns, viewColumns],
  );

  const openCreate = () => {
    if (onBeforeCreate) {
      onBeforeCreate();
      return;
    }
    setSelected(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    if (onBeforeEdit) {
      onBeforeEdit(row);
      return;
    }
    setSelected(row);
    setFormOpen(true);
  };
  const openDelete = (row) => {
    setSelected(row);
    setDeleteOpen(true);
  };
  const openView = (row) => {
    if (onBeforeView) {
      onBeforeView(row);
      return;
    }
    setSelected(row);
    setViewOpen(true);
  };

  return (
    <>
      <PageTitle
        title={title}
        subtitle={subtitle}
        onBack={onBackClick}
        action={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={20} />
            Tambah
          </button>
        }
      />
      {renderHeader && renderHeader(items)}
      <DataTable
        loading={loading}
        data={items}
        columns={columns}
        actions={(row) => (
          <div className="flex items-center gap-1">
            {canView && (
              <button className="btn-ghost !py-2" onClick={() => openView(row)}>
                <Eye size={20} />
                <span className="hidden sm:inline">Lihat</span>
              </button>
            )}
            <button className="btn-yellow !py-2" onClick={() => openEdit(row)}>
              <SquarePen size={20} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button className="btn-red !py-2" onClick={() => openDelete(row)}>
              <Trash2 size={20} />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        )}
      />
      <ResourceFormModal
        open={formOpen}
        title={selected ? `Edit ${title}` : `Tambah ${title}`}
        fields={fields}
        initialData={selected}
        onClose={() => setFormOpen(false)}
        onSubmit={(payload) =>
          selected ? updateItem(selected.id, payload) : createItem(payload)
        }
      />
      <DeleteModal
        open={deleteOpen}
        label={selected?.[labelKey]}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await removeItem(selected.id);
          setDeleteOpen(false);
        }}
      />
      <ViewModal
        open={viewOpen}
        title={`Detail ${title}`}
        data={selected}
        fields={viewFields}
        onClose={() => setViewOpen(false)}
      />
    </>
  );
});

export default ResourcePage;
