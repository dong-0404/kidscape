import { Router } from 'express'
import { listProducts, getProductBySlug } from '../controllers/product.controller.js'

const router = Router()

// Public product read API.
router.get('/', listProducts)
router.get('/:slug', getProductBySlug)

export default router
