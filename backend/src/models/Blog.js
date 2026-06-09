import mongoose from 'mongoose'

const { Schema, model } = mongoose

// A blog/news article shown on /blog and managed in the admin dashboard.
// `content` holds HTML produced by the WYSIWYG editor (sanitized on render).
const blogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, default: '', maxlength: 600 },
    content: { type: String, default: '', maxlength: 20000 },
    imagePath: { type: String, trim: true, default: '' }, // cover image, or '' for fallback icon
    category: { type: String, trim: true, default: '' }, // Category slug
    tags: { type: [String], default: [] },
    author: { type: String, trim: true, default: 'KidScape', maxlength: 100 },
    featured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
)

blogSchema.index({ isActive: 1, order: 1 })
blogSchema.index({ publishedAt: -1 })

export default model('Blog', blogSchema)
