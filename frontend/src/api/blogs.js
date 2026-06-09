import { apiFetch } from './client.js'

// GET /api/blogs?category=<slug> -> [{ _id, slug, title, excerpt, ... }]
export function getBlogs({ category } = {}) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : ''
  return apiFetch(`/blogs${qs}`).then((d) => d.blogs ?? [])
}

// GET /api/blogs/:slug -> blog
export function getBlogBySlug(slug) {
  return apiFetch(`/blogs/${slug}`).then((d) => d.blog)
}
