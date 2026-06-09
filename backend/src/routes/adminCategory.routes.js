import { Router } from 'express'
import authGuard from '../middleware/authGuard.js'
import validate from '../middleware/validate.js'
import {
  adminListCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js'
import { createCategoryRules, updateCategoryRules, idParam } from '../validators/category.validator.js'

const router = Router()

router.use(authGuard)

router.get('/', adminListCategories)
router.post('/', createCategoryRules, validate, createCategory)
router.patch('/:id', idParam, updateCategoryRules, validate, updateCategory)
router.delete('/:id', idParam, validate, deleteCategory)

export default router
