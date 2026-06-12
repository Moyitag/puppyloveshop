const API_URL = 'http://localhost:4000/api';
const TOKEN_KEY = 'puppyLoveToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = token => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = () => Boolean(getToken());

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

export function toApiBody(payload) {
  if (!payload.imageFile) {
    const jsonPayload = { ...payload };
    delete jsonPayload.imageFile;
    return JSON.stringify(jsonPayload);
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'imageFile' || value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, item));
      return;
    }
    formData.append(key, value);
  });

  formData.append('image', payload.imageFile);
  return formData;
}

export async function login(email, password) {
  const data = await apiRequest('/loginEmployee', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  return data;
}

export async function logout() {
  try {
    await apiRequest('/logoutEmployee', { method: 'POST' });
  } finally {
    clearToken();
  }
}
