import { Router } from 'express'
import authGuard from '../middleware/authGuard.js'
import validate from '../middleware/validate.js'
import { uploadBlogImage } from '../middleware/upload.js'
import {
  adminListBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
  deleteImage,
} from '../controllers/blog.controller.js'
import { createBlogRules, updateBlogRules, idParam } from '../validators/blog.validator.js'

const router = Router()

router.use(authGuard)

router.get('/', adminListBlogs)
router.post('/', createBlogRules, validate, createBlog)
router.patch('/:id', idParam, updateBlogRules, validate, updateBlog)
router.delete('/:id', idParam, validate, deleteBlog)

router.post('/:id/image', idParam, validate, uploadBlogImage, uploadImage)
router.delete('/:id/image', idParam, validate, deleteImage)

export default router
