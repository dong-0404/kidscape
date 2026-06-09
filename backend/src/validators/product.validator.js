import { body, param } from 'express-validator'

export const idParam = [param('id').isMongoId().withMessage('ID không hợp lệ')]

// Shared rules for create/update. On update most fields are optional.
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
    req(body('name')).isString().trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm').isLength({ max: 200 }),
    body('tag').optional().isString().trim().isLength({ max: 120 }),
    body('desc').optional().isString().trim().isLength({ max: 600 }),
    body('longDesc').optional().isString().trim().isLength({ max: 4000 }),
    body('color').optional().isString().trim().isLength({ max: 30 }),
    body('emoji').optional().isString().trim().isLength({ max: 16 }),
    body('ageRange').optional().isString().trim().isLength({ max: 60 }),
    body('highlights').optional().isArray().withMessage('highlights phải là mảng'),
    body('highlights.*.title').optional().isString().trim().notEmpty().withMessage('Mỗi điểm nổi bật cần tiêu đề'),
    body('develops').optional().isArray().withMessage('develops phải là mảng'),
    body('status').optional().isIn(['available', 'upcoming']).withMessage('Trạng thái không hợp lệ'),
    body('order').optional().isInt().withMessage('order phải là số nguyên'),
    body('isActive').optional().isBoolean().withMessage('isActive phải là boolean'),
  ]
}

export const createProductRules = rules({ partial: false })
export const updateProductRules = rules({ partial: true })
