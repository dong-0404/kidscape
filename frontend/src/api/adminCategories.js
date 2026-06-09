// Admin CRUD for blog categories (all require auth).
import { apiFetch } from './client.js'

export function listCategories() {
  return apiFetch('/admin/categories', { auth: true }).then((d) => d.categories)
}
export function createCategory(body) {
  return apiFetch('/admin/categories', { method: 'POST', auth: true, body }).then((d) => d.category)
}
export function updateCategory(id, body) {
  return apiFetch(`/admin/categories/${id}`, { method: 'PATCH', auth: true, body }).then((d) => d.category)
}
export function deleteCategory(id) {
  return apiFetch(`/admin/categories/${id}`, { method: 'DELETE', auth: true })
}
