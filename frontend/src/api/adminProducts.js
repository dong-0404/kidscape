// Admin CRUD for products + image upload (all require auth).
import { apiFetch } from './client.js'

export function listProducts() {
  return apiFetch('/admin/products', { auth: true }).then((d) => d.products)
}
export function createProduct(body) {
  return apiFetch('/admin/products', { method: 'POST', auth: true, body }).then((d) => d.product)
}
export function updateProduct(id, body) {
  return apiFetch(`/admin/products/${id}`, { method: 'PATCH', auth: true, body }).then((d) => d.product)
}
export function deleteProduct(id) {
  return apiFetch(`/admin/products/${id}`, { method: 'DELETE', auth: true })
}

// Multipart upload of a product image (field name "image").
export function uploadProductImage(id, file) {
  const form = new FormData()
  form.append('image', file)
  return apiFetch(`/admin/products/${id}/image`, { method: 'POST', auth: true, body: form }).then(
    (d) => d.product
  )
}
export function deleteProductImage(id) {
  return apiFetch(`/admin/products/${id}/image`, { method: 'DELETE', auth: true }).then((d) => d.product)
}
