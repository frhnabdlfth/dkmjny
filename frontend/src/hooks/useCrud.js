import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from "../lib/api";

export function useCrud(path) {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchItems,
  } = useQuery({
    queryKey: [path],
    queryFn: () => listResource(path),
  });

  const error = queryError
    ? queryError?.response?.data?.detail || "Gagal mengambil data"
    : "";

  const createMutation = useMutation({
    mutationFn: (payload) => createResource(path, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [path] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateResource(path, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [path] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteResource(path, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [path] }),
  });

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem: createMutation.mutateAsync,
    updateItem: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    removeItem: deleteMutation.mutateAsync,
  };
}
