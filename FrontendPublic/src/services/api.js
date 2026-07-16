const API_URL = 'http://localhost:4000/api';
const CLIENT_KEY = 'plsClient';

export const getCurrentClient = () => {
  try {
    return JSON.parse(localStorage.getItem(CLIENT_KEY));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getCurrentClient()?.id);

const setCurrentClient = client => localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
const clearCurrentClient = () => localStorage.removeItem(CLIENT_KEY);

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
    clearCurrentClient();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

export async function login(email, password) {
  const data = await apiRequest('/loginClient', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setCurrentClient({ id: data.id, fullName: data.fullName });
  return data;
}

export async function register({ fullName, email, password, phoneNumber }) {
  return apiRequest('/registerClient', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phoneNumber }),
  });
}

export async function logout() {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    clearCurrentClient();
  }
}
