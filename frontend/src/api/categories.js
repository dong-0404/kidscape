import { apiFetch } from './client.js'

// GET /api/categories -> [{ _id, name, slug }]
export function getCategories() {
  return apiFetch('/categories').then((d) => d.categories ?? [])
}
