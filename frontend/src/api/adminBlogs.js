// Admin CRUD for blog posts + cover image upload (all require auth).
import { apiFetch } from './client.js'

export function listBlogs() {
  return apiFetch('/admin/blogs', { auth: true }).then((d) => d.blogs)
}
export function createBlog(body) {
  return apiFetch('/admin/blogs', { method: 'POST', auth: true, body }).then((d) => d.blog)
}
export function updateBlog(id, body) {
  return apiFetch(`/admin/blogs/${id}`, { method: 'PATCH', auth: true, body }).then((d) => d.blog)
}
export function deleteBlog(id) {
  return apiFetch(`/admin/blogs/${id}`, { method: 'DELETE', auth: true })
}

export function uploadBlogImage(id, file) {
  const form = new FormData()
  form.append('image', file)
  return apiFetch(`/admin/blogs/${id}/image`, { method: 'POST', auth: true, body: form }).then((d) => d.blog)
}
export function deleteBlogImage(id) {
  return apiFetch(`/admin/blogs/${id}/image`, { method: 'DELETE', auth: true }).then((d) => d.blog)
}
