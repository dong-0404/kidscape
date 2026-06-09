import { Router } from 'express'
import authGuard from '../middleware/authGuard.js'
import validate from '../middleware/validate.js'
import { suggestionRules, kbRules, idParam } from '../validators/chat.validator.js'
import {
  adminListSuggestions,
  createSuggestion,
  updateSuggestion,
  deleteSuggestion,
  adminListKb,
  createKb,
  updateKb,
  deleteKb,
} from '../controllers/chat.controller.js'

const router = Router()

// All admin chatbot routes require a valid admin JWT.
router.use(authGuard)

// Suggestions (chips + canned answers).
router.get('/suggestions', adminListSuggestions)
router.post('/suggestions', suggestionRules, validate, createSuggestion)
router.patch('/suggestions/:id', idParam, suggestionRules, validate, updateSuggestion)
router.delete('/suggestions/:id', idParam, validate, deleteSuggestion)

// Knowledge base entries.
router.get('/kb', adminListKb)
router.post('/kb', kbRules, validate, createKb)
router.patch('/kb/:id', idParam, kbRules, validate, updateKb)
router.delete('/kb/:id', idParam, validate, deleteKb)

export default router
