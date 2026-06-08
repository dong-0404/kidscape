import { Router } from 'express'
import { login, me, changePassword } from '../controllers/auth.controller.js'
import { loginRules, changePasswordRules } from '../validators/auth.validator.js'
import validate from '../middleware/validate.js'
import authGuard from '../middleware/authGuard.js'
import { loginLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/login', loginLimiter, loginRules, validate, login)
router.get('/me', authGuard, me)
router.patch('/password', authGuard, changePasswordRules, validate, changePassword)

export default router
