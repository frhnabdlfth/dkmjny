import { ArrowUpDown, Funnel, Search } from "lucide-react";

export default function SearchFilterSort({
  search,
  onSearchChange,

  filterValue,
  onFilterChange,
  filterOptions = [],

  sortValue,
  onSortChange,
  sortOptions = [],
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[250px] flex items-center h-11 rounded-xl border border-gray-300 bg-gray-50 px-4 gap-2">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Cari data..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>

      {/* Sort */}
      {sortOptions.length > 0 && (
        <div className="relative">
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-11 pl-9 pr-8 rounded-xl border border-gray-300 bg-gray-50 appearance-none cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter */}
      {filterOptions.length > 0 && (
        <div className="relative">
          <Funnel
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-11 pl-9 pr-8 rounded-xl border border-gray-300 bg-gray-50 appearance-none cursor-pointer"
          >
            <option value="">Semua Data</option>

            {filterOptions.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}