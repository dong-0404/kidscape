import Category from '../models/Category.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'

const FIELDS = ['name', 'slug', 'order', 'isActive']
function pick(body) {
  const out = {}
  for (const f of FIELDS) if (body[f] !== undefined) out[f] = body[f]
  return out
}

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/categories — active categories in display order.
export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean()
  return ok(res, { categories })
})

// ── Admin CRUD ──────────────────────────────────────────────────────────────

export const adminListCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean()
  return ok(res, { categories })
})

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(pick(req.body))
  return created(res, { category })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  })
  if (!category) throw ApiError.notFound('Không tìm thấy danh mục')
  return ok(res, { category })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) throw ApiError.notFound('Không tìm thấy danh mục')
  return noContent(res)
})
