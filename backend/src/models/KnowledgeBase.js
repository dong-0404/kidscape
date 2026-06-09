import mongoose from 'mongoose'

const { Schema, model } = mongoose

// A snippet of KidScape knowledge the chatbot is grounded on (prompt-stuffed
// into the Gemini systemInstruction). Admins curate these in the dashboard.
const knowledgeBaseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Active entries, in display order — the common query for grounding + admin list.
knowledgeBaseSchema.index({ isActive: 1, order: 1 })

export default model('KnowledgeBase', knowledgeBaseSchema)
