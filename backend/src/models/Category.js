import mongoose from 'mongoose'

const { Schema, model } = mongoose

// A blog/news category managed in the admin dashboard. Blogs reference it by slug.
const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

categorySchema.index({ isActive: 1, order: 1 })

export default model('Category', categorySchema)
