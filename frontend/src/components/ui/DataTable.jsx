export default function DataTable({ columns, data, actions, loading }) {
  if (loading) {
    return (
      <div className="card p-8 text-center text-black/50">Loading data...</div>
    );
  }

  if (!data?.length) {
    return (
      <div className="card p-8 text-center text-black/50">Belum ada data.</div>
    );
  }

  return (
    <div className="card overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black/5">
          <thead className="bg-black/[0.02]">
            <tr>
              <th className="table-th text-nowrap text-center w-10 text-ink">No</th>
              {columns.map((col) => (
                <th key={col.key} className="table-th text-nowrap text-ink">
                  {col.label}
                </th>
              ))}
              {actions && <th className="table-th text-nowrap text-ink">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.map((row, index) => (
              <tr key={row.id} className="hover:bg-black/[0.015]">
                <td className="table-td text-nowrap text-center text-xs sm:text-sm font-medium w-12">
                  {index + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="table-td text-nowrap text-xs sm:text-sm"
                  >
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
    </div>
  );
}
