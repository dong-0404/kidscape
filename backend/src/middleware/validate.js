import { validationResult } from 'express-validator'

// Runs after express-validator chains; returns 422 with field errors if any.
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  return res.status(422).json({
    success: false,
    error: {
      message: 'Dữ liệu không hợp lệ',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    },
  })
}

export default validate
