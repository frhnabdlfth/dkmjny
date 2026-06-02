import { useMemo, useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import DataTable from "../components/ui/DataTable";
import ResourceFormModal from "../components/modals/ResourceFormModal";
import DeleteModal from "../components/modals/DeleteModal";
import ViewModal from "../components/modals/ViewModal";
import { useCrud } from "../hooks/useCrud";

export default function ResourcePage({
  title,
  subtitle,
  path,
  columns,
  fields,
  labelKey,
  canView = false,
}) {
  const { items, loading, createItem, updateItem, removeItem } = useCrud(path);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const viewFields = useMemo(
    () =>
      columns.map((col) => ({
        key: col.key,
        label: col.label,
        render: col.render,
      })),
    [columns],
  );

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setSelected(row);
    setFormOpen(true);
  };
  const openDelete = (row) => {
    setSelected(row);
    setDeleteOpen(true);
  };
  const openView = (row) => {
    setSelected(row);
    setViewOpen(true);
  };

  return (
    <>
      <PageTitle
        title={title}
        subtitle={subtitle}
        action={
          <button className="btn-primary" onClick={openCreate}>
            + Tambah
          </button>
        }
      />
      <DataTable
        loading={loading}
        data={items}
        columns={columns}
        actions={(row) => (
          <>
            {canView && (
              <button className="btn-ghost !py-2" onClick={() => openView(row)}>
                Lihat
              </button>
            )}
            <button className="btn-ghost !py-2" onClick={() => openEdit(row)}>
              Edit
            </button>
            <button className="btn-dark !py-2" onClick={() => openDelete(row)}>
              Hapus
            </button>
          </>
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
}
