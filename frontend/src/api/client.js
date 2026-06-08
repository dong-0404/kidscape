// Lightweight fetch wrapper for the KidScape API.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
const TOKEN_KEY = "kidscape_admin_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Call the API. Returns the `data` field of the standard envelope.
 * @param {string} path  e.g. '/auth/login'
 * @param {{ method?: string, body?: any, auth?: boolean, headers?: object }} [options]
 */
export async function apiFetch(
  path,
  { method = "GET", body, auth = false, headers = {} } = {},
) {
  const opts = { method, headers: { ...headers } };

  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  if (auth) {
    const token = tokenStore.get();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, opts);
  } catch {
    throw new ApiError(
      "Không thể kết nối tới máy chủ. Backend đã chạy chưa?",
      0,
    );
  }

  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message =
      payload?.error?.message || `Đã xảy ra lỗi (HTTP ${res.status})`;
    throw new ApiError(message, res.status, payload?.error?.details);
  }

  return payload?.data ?? payload;
}
