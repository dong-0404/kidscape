import { Router } from 'express'
import authGuard from '../middleware/authGuard.js'
import validate from '../middleware/validate.js'
import uploadProductImage from '../middleware/upload.js'
import {
  adminListProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
} from '../controllers/product.controller.js'
import { createProductRules, updateProductRules, idParam } from '../validators/product.validator.js'

const router = Router()

router.use(authGuard)

router.get('/', adminListProducts)
router.post('/', createProductRules, validate, createProduct)
router.patch('/:id', idParam, updateProductRules, validate, updateProduct)
router.delete('/:id', idParam, validate, deleteProduct)

// Image upload/remove (multipart for upload).
router.post('/:id/image', idParam, validate, uploadProductImage, uploadImage)
router.delete('/:id/image', idParam, validate, deleteImage)

export default router
