// Admin CRUD for chatbot suggestions + knowledge base (all require auth).
import { apiFetch } from './client.js'

// ── Suggestions ──
export function listSuggestions() {
  return apiFetch('/admin/chat/suggestions', { auth: true }).then((d) => d.suggestions)
}
export function createSuggestion(body) {
  return apiFetch('/admin/chat/suggestions', { method: 'POST', auth: true, body }).then((d) => d.suggestion)
}
export function updateSuggestion(id, body) {
  return apiFetch(`/admin/chat/suggestions/${id}`, { method: 'PATCH', auth: true, body }).then((d) => d.suggestion)
}
export function deleteSuggestion(id) {
  return apiFetch(`/admin/chat/suggestions/${id}`, { method: 'DELETE', auth: true })
}

// ── Knowledge base ──
export function listKb() {
  return apiFetch('/admin/chat/kb', { auth: true }).then((d) => d.entries)
}
export function createKb(body) {
  return apiFetch('/admin/chat/kb', { method: 'POST', auth: true, body }).then((d) => d.entry)
}
export function updateKb(id, body) {
  return apiFetch(`/admin/chat/kb/${id}`, { method: 'PATCH', auth: true, body }).then((d) => d.entry)
}
export function deleteKb(id) {
  return apiFetch(`/admin/chat/kb/${id}`, { method: 'DELETE', auth: true })
}
