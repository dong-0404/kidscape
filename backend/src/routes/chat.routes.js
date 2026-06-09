import { Router } from 'express'
import { listSuggestions, ask } from '../controllers/chat.controller.js'
import { askRules } from '../validators/chat.validator.js'
import validate from '../middleware/validate.js'
import { chatLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public chatbot endpoints.
router.get('/suggestions', listSuggestions)
router.post('/ask', chatLimiter, askRules, validate, ask)

export default router
