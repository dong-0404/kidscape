import fs from 'fs'
import path from 'path'
import Blog from '../models/Blog.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'
import { config } from '../config/env.js'

// Editable fields (image handled by its own endpoint).
const FIELDS = [
  'slug',
  'title',
  'excerpt',
  'content',
  'category',
  'tags',
  'author',
  'featured',
  'order',
  'isActive',
  'publishedAt',
]

function pick(body) {
  const out = {}
  for (const f of FIELDS) if (body[f] !== undefined) out[f] = body[f]
  return out
}

function removeImageFile(imagePath) {
  if (!imagePath) return
  const file = path.join(config.uploads.dir, path.basename(imagePath))
  fs.promises.unlink(file).catch(() => {})
}

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/blogs?category=<slug> — active articles, newest first.
export const listBlogs = asyncHandler(async (req, res) => {
  const filter = { isActive: true }
  if (req.query.category) filter.category = String(req.query.category)
  const blogs = await Blog.find(filter).sort({ order: 1, publishedAt: -1, createdAt: -1 }).lean()
  return ok(res, { blogs })
})

// GET /api/blogs/:slug — a single active article.
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isActive: true }).lean()
  if (!blog) throw ApiError.notFound('Không tìm thấy bài viết')
  return ok(res, { blog })
})

// ── Admin CRUD ──────────────────────────────────────────────────────────────

export const adminListBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ order: 1, publishedAt: -1, createdAt: -1 }).lean()
  return ok(res, { blogs })
})

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(pick(req.body))
  return created(res, { blog })
})

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  })
  if (!blog) throw ApiError.notFound('Không tìm thấy bài viết')
  return ok(res, { blog })
})

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id)
  if (!blog) throw ApiError.notFound('Không tìm thấy bài viết')
  removeImageFile(blog.imagePath)
  return noContent(res)
})

// POST /api/admin/blogs/:id/image — multipart, single field "image".
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Chưa chọn ảnh để tải lên')

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    removeImageFile(`${config.uploads.publicPath}/${req.file.filename}`)
    throw ApiError.notFound('Không tìm thấy bài viết')
  }

  const oldImage = blog.imagePath
  blog.imagePath = `${config.uploads.publicPath}/${req.file.filename}`
  await blog.save()
  if (oldImage && oldImage !== blog.imagePath) removeImageFile(oldImage)

  return ok(res, { blog })
})

// DELETE /api/admin/blogs/:id/image — remove the current cover image.
export const deleteImage = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) throw ApiError.notFound('Không tìm thấy bài viết')
  removeImageFile(blog.imagePath)
  blog.imagePath = ''
  await blog.save()
  return ok(res, { blog })
})
