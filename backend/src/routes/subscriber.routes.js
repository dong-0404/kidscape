import { Router } from 'express'
import { subscribe } from '../controllers/subscriber.controller.js'
import { subscribeRules } from '../validators/subscriber.validator.js'
import validate from '../middleware/validate.js'
import { subscribeLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public newsletter subscribe.
router.post('/', subscribeLimiter, subscribeRules, validate, subscribe)

export default router
