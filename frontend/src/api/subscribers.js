import { apiFetch } from './client.js'

// POST /api/subscribers -> { message }
export function subscribe(email) {
  return apiFetch('/subscribers', { method: 'POST', body: { email } })
}
