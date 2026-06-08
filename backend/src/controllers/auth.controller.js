import Admin from '../models/Admin.js'
import { signToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ok } from '../utils/ApiResponse.js'

// Shape an admin doc for client responses (never leak passwordHash).
function publicAdmin(a) {
  return {
    id: a._id,
    name: a.name,
    email: a.email,
    isActive: a.isActive,
    lastLoginAt: a.lastLoginAt,
  }
}

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim()
  const password = String(req.body.password || '')

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  // Same generic message whether the email or the password is wrong.
  if (!admin || !admin.isActive) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng')

  const valid = await admin.comparePassword(password)
  if (!valid) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng')

  admin.lastLoginAt = new Date()
  await admin.save()

  const token = signToken({ sub: admin._id.toString() })
  return ok(res, { token, admin: publicAdmin(admin) })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  return ok(res, { admin: publicAdmin(req.admin) })
})

// PATCH /api/auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const admin = await Admin.findById(req.admin._id).select('+passwordHash')
  const valid = await admin.comparePassword(currentPassword)
  if (!valid) throw ApiError.badRequest('Mật khẩu hiện tại không đúng')

  admin.passwordHash = await Admin.hashPassword(newPassword)
  await admin.save()

  return ok(res, { message: 'Đổi mật khẩu thành công' })
})
