import { Router } from 'express'
import { listCategories } from '../controllers/category.controller.js'

const router = Router()

// Public category list (for blog filter chips).
router.get('/', listCategories)

export default router
