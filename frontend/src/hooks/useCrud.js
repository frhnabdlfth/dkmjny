import { useCallback, useEffect, useState } from 'react'
import { createResource, deleteResource, listResource, updateResource } from '../lib/api'

export function useCrud(path) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setItems(await listResource(path))
      setError('')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => { fetchItems() }, [fetchItems])

  const createItem = async (payload) => { await createResource(path, payload); await fetchItems() }
  const updateItem = async (id, payload) => { await updateResource(path, id, payload); await fetchItems() }
  const removeItem = async (id) => { await deleteResource(path, id); await fetchItems() }

  return { items, loading, error, fetchItems, createItem, updateItem, removeItem }
}
