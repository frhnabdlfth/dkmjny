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
    <div className="mb-6 flex items-center gap-3">
      {/* Search */}
      <div className="flex-1 min-w-0 flex items-center h-11 rounded-xl border border-gray-300 bg-gray-50 px-4 gap-2">
        <Search size={18} className="text-gray-500 shrink-0" />
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
  <div className="relative shrink-0">
    <ArrowUpDown
      size={16}
      className="absolute left-1/2 -translate-x-1/2 sm:left-3 sm:translate-x-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    />
    <select
      value={sortValue}
      onChange={(e) => onSortChange(e.target.value)}
      className="h-11 w-11 sm:w-auto pl-9 sm:pr-8 rounded-xl border border-gray-300 bg-gray-50 appearance-none cursor-pointer text-transparent sm:text-gray-800"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value} className="text-gray-800">
          {option.label}
        </option>
      ))}
    </select>
  </div>
)}

{/* Filter */}
{filterOptions.length > 0 && (
  <div className="relative shrink-0">
    <Funnel
      size={16}
      className="absolute left-1/2 -translate-x-1/2 sm:left-3 sm:translate-x-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    />
    <select
      value={filterValue}
      onChange={(e) => onFilterChange(e.target.value)}
      className="h-11 w-11 sm:w-auto pl-9 sm:pr-8 rounded-xl border border-gray-300 bg-gray-50 appearance-none cursor-pointer text-transparent sm:text-gray-800"
    >
      <option value="" className="text-gray-800">Semua Data</option>
      {filterOptions.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-800">
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
