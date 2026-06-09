import mongoose from 'mongoose'

const { Schema, model } = mongoose

// One highlight bullet shown on the product detail page.
const highlightSchema = new Schema(
  {
    icon: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, required: true, maxlength: 120 },
    desc: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { _id: false }
)

// A product shown on the public site + managed in the admin dashboard.
// `status: 'upcoming'` renders as a dimmed "Sắp ra mắt" teaser (no detail page).
const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    tag: { type: String, trim: true, default: '', maxlength: 120 },
    desc: { type: String, trim: true, default: '', maxlength: 600 },
    longDesc: { type: String, trim: true, default: '', maxlength: 4000 },
    color: { type: String, trim: true, default: '#FF6B6B' },
    emoji: { type: String, trim: true, default: '🧸' },
    // Path to an uploaded image (e.g. "/uploads/abc.jpg") or '' to fall back to the emoji.
    imagePath: { type: String, trim: true, default: '' },
    ageRange: { type: String, trim: true, default: '', maxlength: 60 },
    highlights: { type: [highlightSchema], default: [] },
    develops: { type: [String], default: [] },
    status: { type: String, enum: ['available', 'upcoming'], default: 'available', index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

// Active products in display order — the common public + admin query.
productSchema.index({ isActive: 1, order: 1 })

export default model('Product', productSchema)
