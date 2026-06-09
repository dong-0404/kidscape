import mongoose from 'mongoose'

const { Schema, model } = mongoose

// An email captured from the "nhận tin sản phẩm mới" box on the products page.
const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    source: { type: String, trim: true, default: 'products' },
  },
  { timestamps: true }
)

export default model('Subscriber', subscriberSchema)
