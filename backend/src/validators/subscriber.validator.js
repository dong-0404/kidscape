import { body, param } from 'express-validator'

export const subscribeRules = [
  body('email').isEmail().withMessage('Email không hợp lệ').bail().normalizeEmail().isLength({ max: 254 }),
]

export const idParam = [param('id').isMongoId().withMessage('ID không hợp lệ')]
