import { body, param } from 'express-validator'

export const idParam = [param('id').isMongoId().withMessage('ID không hợp lệ')]

function rules({ partial }) {
  const req = (chain) => (partial ? chain.optional() : chain)
  return [
    req(body('slug'))
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Vui lòng nhập slug')
      .bail()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
    req(body('title')).isString().trim().notEmpty().withMessage('Vui lòng nhập tiêu đề').isLength({ max: 200 }),
    body('excerpt').optional().isString().trim().isLength({ max: 600 }),
    body('content').optional().isString().isLength({ max: 20000 }),
    body('category').optional().isString().trim().isLength({ max: 120 }),
    body('tags').optional().isArray().withMessage('tags phải là mảng'),
    body('author').optional().isString().trim().isLength({ max: 100 }),
    body('featured').optional().isBoolean().withMessage('featured phải là boolean'),
    body('isActive').optional().isBoolean().withMessage('isActive phải là boolean'),
    body('order').optional().isInt().withMessage('order phải là số nguyên'),
    body('publishedAt').optional().isISO8601().withMessage('Ngày công bố không hợp lệ'),
  ]
}

export const createBlogRules = rules({ partial: false })
export const updateBlogRules = rules({ partial: true })
