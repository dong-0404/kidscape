import { body } from 'express-validator'

export const loginRules = [
  body('email').isEmail().withMessage('Email không hợp lệ').bail().trim(),
  body('password').isString().withMessage('Mật khẩu không hợp lệ').bail().notEmpty().withMessage('Vui lòng nhập mật khẩu'),
]

export const changePasswordRules = [
  body('currentPassword').isString().notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Mật khẩu mới tối thiểu 8 ký tự'),
]
