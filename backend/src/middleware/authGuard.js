import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import Admin from '../models/Admin.js'

// Verifies the Bearer JWT, re-loads the admin, and rejects disabled accounts
// (so an admin can be revoked instantly via isActive).
export const authGuard = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null
  if (!token) throw ApiError.unauthorized('Thiếu token xác thực')

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Token không hợp lệ hoặc đã hết hạn')
  }

  const admin = await Admin.findById(payload.sub)
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Tài khoản không tồn tại hoặc đã bị khóa')
  }

  req.admin = admin
  next()
})

export default authGuard
