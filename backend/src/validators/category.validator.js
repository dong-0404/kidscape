import { body, param } from 'express-validator'

export const idParam = [param('id').isMongoId().withMessage('ID không hợp lệ')]

function rules({ partial }) {
  const req = (chain) => (partial ? chain.optional() : chain)
  return [
    req(body('name')).isString().trim().notEmpty().withMessage('Vui lòng nhập tên danh mục').isLength({ max: 100 }),
    req(body('slug'))
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Vui lòng nhập slug')
      .bail()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
    body('order').optional().isInt().withMessage('order phải là số nguyên'),
    body('isActive').optional().isBoolean().withMessage('isActive phải là boolean'),
  ]
}

export const createCategoryRules = rules({ partial: false })
export const updateCategoryRules = rules({ partial: true })
