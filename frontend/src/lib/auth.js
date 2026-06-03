const DUMMY_USER = {
  id: 1,
  name: "Admin DKMJNY",
  email: "admin@dkmjny.com",
  password: "admin123",
  role: "Admin",
};

const AUTH_KEY = "dkmjny_auth_user";

export function login(email, password) {
  const isValid =
    email === DUMMY_USER.email && password === DUMMY_USER.password;

  if (!isValid) {
    throw new Error("Email atau password salah");
  }

  const user = {
    id: DUMMY_USER.id,
    name: DUMMY_USER.name,
    email: DUMMY_USER.email,
    role: DUMMY_USER.role,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
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

export function isAuthenticated() {
  return Boolean(getAuthUser());
}