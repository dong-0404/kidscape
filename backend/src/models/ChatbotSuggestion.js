import mongoose from 'mongoose'

const { Schema, model } = mongoose

// A suggested question shown as a chip in the widget, with a canned answer.
// Clicking a chip shows `answer` instantly (no AI call); the answer is also
// part of the grounding data so free-form questions can reuse it.
const chatbotSuggestionSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 3000 },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

chatbotSuggestionSchema.index({ isActive: 1, order: 1 })

export default model('ChatbotSuggestion', chatbotSuggestionSchema)
