import { config } from '../config/env.js'

// Centralized error handler — normalizes common error shapes into one envelope.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Lỗi máy chủ'
  let details = err.details

  if (err.name === 'ValidationError') {
    // Mongoose schema validation
    statusCode = 422
    message = 'Dữ liệu không hợp lệ'
    details = Object.values(err.errors || {}).map((e) => ({ field: e.path, message: e.message }))
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = `Giá trị không hợp lệ cho trường "${err.path}"`
  } else if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0]
    message = field ? `Giá trị đã tồn tại cho trường "${field}"` : 'Dữ liệu đã tồn tại'
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token không hợp lệ hoặc đã hết hạn'
  }

  if (statusCode >= 500) console.error(err)

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(config.isProd ? {} : { stack: err.stack }),
    },
  })
}

export default errorHandler
