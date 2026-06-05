import { useMemo } from "react";

export default function useTableFilter({
  data = [],
  search = "",
  searchFields = [],
  filterField,
  filterValue,
  sortField,
  sortOrder = "desc",
}) {
  return useMemo(() => {
    let result = [...data];

    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(keyword),
        ),
      );
    }

    if (filterField && filterValue) {
      result = result.filter((item) => item[filterField] === filterValue);
    }

    if (sortField) {
      result.sort((a, b) => {
        const first = a[sortField];
        const second = b[sortField];

        if (sortOrder === "asc") {
          return first > second ? 1 : -1;
        }

        return first < second ? 1 : -1;
      });
    }

    return result;
  }, [
    data,
    search,
    searchFields,
    filterField,
    filterValue,
    sortField,
    sortOrder,
  ]);
}
