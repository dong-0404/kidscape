import { body, param } from 'express-validator'
import { config } from '../config/env.js'

export const askRules = [
  body('question')
    .isString()
    .withMessage('Câu hỏi không hợp lệ')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Vui lòng nhập câu hỏi')
    .bail()
    .isLength({ max: config.chat.maxInput })
    .withMessage(`Câu hỏi tối đa ${config.chat.maxInput} ký tự`),
]

export const idParam = [param('id').isMongoId().withMessage('ID không hợp lệ')]

export const suggestionRules = [
  body('question').isString().trim().notEmpty().withMessage('Vui lòng nhập câu hỏi').isLength({ max: 300 }),
  body('answer').isString().trim().notEmpty().withMessage('Vui lòng nhập câu trả lời').isLength({ max: 3000 }),
  body('isActive').optional().isBoolean().withMessage('isActive phải là boolean'),
  body('order').optional().isInt().withMessage('order phải là số nguyên'),
]

export const kbRules = [
  body('title').isString().trim().notEmpty().withMessage('Vui lòng nhập tiêu đề').isLength({ max: 200 }),
  body('content').isString().trim().notEmpty().withMessage('Vui lòng nhập nội dung').isLength({ max: 5000 }),
  body('tags').optional().isArray().withMessage('tags phải là mảng'),
  body('isActive').optional().isBoolean().withMessage('isActive phải là boolean'),
  body('order').optional().isInt().withMessage('order phải là số nguyên'),
]
