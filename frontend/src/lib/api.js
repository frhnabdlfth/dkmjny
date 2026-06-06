import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dkmjny_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/login")
    ) {
      localStorage.removeItem("dkmjny_auth_user");
      localStorage.removeItem("dkmjny_auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export async function listResource(path) {
  return (await api.get(path)).data;
}

export async function createResource(path, payload) {
  const isFormData = payload instanceof FormData;
  return (
    await api.post(path, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    })
  ).data;
}

export async function updateResource(path, id, payload) {
  const isFormData = payload instanceof FormData;

  return (
    await api.put(`${path}/${id}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    })
  ).data;
}

export async function deleteResource(path, id) {
  return (await api.delete(`${path}/${id}`)).data;
}
