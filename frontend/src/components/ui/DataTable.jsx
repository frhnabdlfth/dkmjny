export default function DataTable({ columns, data, actions, loading }) {
  if (loading)
    return (
      <div className="card p-8 text-center text-black/50">Loading data...</div>
    );
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
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
    </div>
  );
}
