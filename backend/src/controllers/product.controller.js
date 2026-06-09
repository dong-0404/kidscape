import fs from 'fs'
import path from 'path'
import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'
import { config } from '../config/env.js'

// Whitelist of editable fields (image is handled by its own endpoint).
const FIELDS = [
  'slug',
  'name',
  'tag',
  'desc',
  'longDesc',
  'color',
  'emoji',
  'ageRange',
  'highlights',
  'develops',
  'status',
  'order',
  'isActive',
]

function pick(body) {
  const out = {}
  for (const f of FIELDS) if (body[f] !== undefined) out[f] = body[f]
  return out
}

// Remove an uploaded file referenced by a stored imagePath ("/uploads/xxx").
function removeImageFile(imagePath) {
  if (!imagePath) return
  const file = path.join(config.uploads.dir, path.basename(imagePath))
  fs.promises.unlink(file).catch(() => {})
}

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/products — active products, both statuses (frontend splits them).
export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean()
  return ok(res, { products })
})

// GET /api/products/:slug — a single active product.
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean()
  if (!product) throw ApiError.notFound('Không tìm thấy sản phẩm')
  return ok(res, { product })
})

// ── Admin CRUD ──────────────────────────────────────────────────────────────

export const adminListProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ order: 1, createdAt: 1 }).lean()
  return ok(res, { products })
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pick(req.body))
  return created(res, { product })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  })
  if (!product) throw ApiError.notFound('Không tìm thấy sản phẩm')
  return ok(res, { product })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw ApiError.notFound('Không tìm thấy sản phẩm')
  removeImageFile(product.imagePath)
  return noContent(res)
})

// POST /api/admin/products/:id/image — multipart, single field "image".
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Chưa chọn ảnh để tải lên')

  const product = await Product.findById(req.params.id)
  if (!product) {
    // Orphan the just-uploaded file so it doesn't linger.
    removeImageFile(`${config.uploads.publicPath}/${req.file.filename}`)
    throw ApiError.notFound('Không tìm thấy sản phẩm')
  }

  const oldImage = product.imagePath
  product.imagePath = `${config.uploads.publicPath}/${req.file.filename}`
  await product.save()
  if (oldImage && oldImage !== product.imagePath) removeImageFile(oldImage)

  return ok(res, { product })
})

// DELETE /api/admin/products/:id/image — remove the current image.
export const deleteImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw ApiError.notFound('Không tìm thấy sản phẩm')
  removeImageFile(product.imagePath)
  product.imagePath = ''
  await product.save()
  return ok(res, { product })
})
