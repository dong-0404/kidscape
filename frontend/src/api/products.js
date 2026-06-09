import { apiFetch } from './client.js'

// GET /api/products -> [{ _id, slug, name, tag, ..., status }]
export function getProducts() {
  return apiFetch('/products').then((d) => d.products ?? [])
}

// GET /api/products/:slug -> product
export function getProductBySlug(slug) {
  return apiFetch(`/products/${slug}`).then((d) => d.product)
}
