import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { config } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Ensure the uploads dir exists at boot (dev + first container start).
fs.mkdirSync(config.uploads.dir, { recursive: true })

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploads.dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10)
    const rand = Math.random().toString(36).slice(2, 10)
    cb(null, `product-${Date.now()}-${rand}${ext}`)
  },
})

function fileFilter(req, file, cb) {
  if (ALLOWED.has(file.mimetype)) return cb(null, true)
  cb(ApiError.badRequest('Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF.'))
}

// Single image field named "image".
export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
}).single('image')

export default uploadProductImage
