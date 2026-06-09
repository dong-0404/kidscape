import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { config } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Ensure the uploads dir exists at boot (dev + first container start).
fs.mkdirSync(config.uploads.dir, { recursive: true })

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function fileFilter(req, file, cb) {
  if (ALLOWED.has(file.mimetype)) return cb(null, true)
  cb(ApiError.badRequest('Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF.'))
}

// Build a single-image ("image" field) multer middleware whose filenames are
// prefixed (e.g. "product-…", "blog-…") for easy identification on disk.
function createUpload(prefix) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, config.uploads.dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().slice(0, 10)
      const rand = Math.random().toString(36).slice(2, 10)
      cb(null, `${prefix}-${Date.now()}-${rand}${ext}`)
    },
  })
  return multer({ storage, fileFilter, limits: { fileSize: config.uploads.maxBytes, files: 1 } }).single('image')
}

export const uploadProductImage = createUpload('product')
export const uploadBlogImage = createUpload('blog')

export default uploadProductImage
