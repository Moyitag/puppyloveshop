const API_URL = 'http://localhost:4000/api';
const AUTH_FLAG_KEY = 'plsAdminAuth';

export const isAuthenticated = () => localStorage.getItem(AUTH_FLAG_KEY) === '1';

const setAuthenticated = () => localStorage.setItem(AUTH_FLAG_KEY, '1');
const clearAuthenticated = () => localStorage.removeItem(AUTH_FLAG_KEY);

export async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    clearAuthenticated();
  }

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
      if (value.length > 0 && typeof value[0] === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        value.forEach(item => formData.append(key, item));
      }
      return;
    }
    formData.append(key, value);
  });

  formData.append('images', payload.imageFile);
  return formData;
}

export async function login(email, password) {
  const data = await apiRequest('/loginAdministrator', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAuthenticated();
  return data;
}

export async function logout() {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    clearAuthenticated();
  }
}
