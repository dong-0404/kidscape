import { apiFetch, tokenStore } from './client.js'

// POST /api/auth/login -> { token, admin }
export function login(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

// GET /api/auth/me -> { admin }
export function getMe() {
  return apiFetch('/auth/me', { auth: true })
}

// PATCH /api/auth/password -> { message }
export function changePassword(currentPassword, newPassword) {
  return apiFetch('/auth/password', {
    method: 'PATCH',
    auth: true,
    body: { currentPassword, newPassword },
  })
}

// GET /api/health -> { status, db, uptime }
export function getHealth() {
  return apiFetch('/health')
}

export { tokenStore }
