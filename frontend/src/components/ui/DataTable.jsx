export default function DataTable({ columns, data, actions, loading }) {
  if (loading) {
    return <div className="card p-8 text-center text-black/50">Loading data...</div>;
  }

  if (!data?.length) {
    return <div className="card p-8 text-center text-black/50">Belum ada data.</div>;
  }

  return (
    <div className="card overflow-hidden">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-black/5">
          <thead className="bg-black/[0.02]">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-th">
                  {col.label}
                </th>
              ))}
              {actions && <th className="table-th">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-black/[0.015]">
                {columns.map((col) => (
                  <td key={col.key} className="table-td">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="table-td">
                    <div className="flex flex-wrap gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {data.map((row) => (
          <article key={row.id} className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="grid gap-3">
              {columns.map((col) => (
                <div key={col.key} className="min-w-0">
                  <p className="label">{col.label}</p>
                  <div className="mt-1 break-words text-sm font-semibold text-ink">
                    {col.render ? col.render(row) : row[col.key]}
                  </div>
                </div>
              ))}
            </div>

            {actions && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4">
                {actions(row)}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
