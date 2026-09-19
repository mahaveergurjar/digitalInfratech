export function parseStoredJson(value, fallback = null) {
  if (!value || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text.trim()) {
    return { data: null, parseError: 'Empty server response' };
  }
  try {
    return { data: JSON.parse(text), parseError: null };
  } catch {
    return { data: null, parseError: 'Invalid JSON response from server' };
  }
}

export const DEV_ADMIN = {
  email: 'admin@digitalinfratech.in',
  password: 'admin123',
  token: 'dev-admin-token',
};

export function isDevAdminToken(token) {
  return import.meta.env.DEV && token === DEV_ADMIN.token;
}
