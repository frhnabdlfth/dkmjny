import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({ baseURL });

export async function listResource(path) {
  return (await api.get(path)).data;
}

export async function createResource(path, payload) {
  const isFormData = payload instanceof FormData;
  return (await api.post(path, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  })).data;
}

export async function updateResource(path, id, payload) {
  const isFormData = payload instanceof FormData;

  return (await api.put(`${path}/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  })).data;
}

export async function deleteResource(path, id) {
  return (await api.delete(`${path}/${id}`)).data;
}
