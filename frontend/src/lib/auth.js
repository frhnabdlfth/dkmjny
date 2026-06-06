import { api } from "./api";

const AUTH_KEY = "dkmjny_auth_user";
const TOKEN_KEY = "dkmjny_auth_token";

export async function login(loginId, password) {
  try {
    const response = await api.post("/auth/login", {
      login_id: loginId,
      password: password,
    });

    const { access_token, user } = response.data;

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));

    return user;
  } catch (err) {
    const message =
      err.response?.data?.detail || "Login gagal, periksa koneksi server";
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthUser() {
  const user = localStorage.getItem(AUTH_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthUser()) && Boolean(getToken());
}