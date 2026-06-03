import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({ baseURL });

export async function listResource(path) {
  return (await api.get(path)).data;
}

export async function createResource(path, payload) {
  return (await api.post(path, payload)).data;
}

export async function updateResource(path, id, payload) {
  return (await api.put(`${path}/${id}`, payload)).data;
}

export async function deleteResource(path, id) {
  return (await api.delete(`${path}/${id}`)).data;
}
