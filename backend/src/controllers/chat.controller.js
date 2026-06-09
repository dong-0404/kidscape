import KnowledgeBase from '../models/KnowledgeBase.js'
import ChatbotSuggestion from '../models/ChatbotSuggestion.js'
import * as gemini from '../services/gemini.service.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'

const ERROR_LINE = 'Xin lỗi, mình đang gặp chút trục trặc. Bạn thử lại sau một chút nhé!'

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/chat/suggestions — chips + canned answers for the widget.
export const listSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await ChatbotSuggestion.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .select('question answer')
    .lean()
  return ok(res, { suggestions })
})

// Helper: write one SSE frame.
function sse(res, event, data) {
  if (event) res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

// POST /api/chat/ask — streams the answer as Server-Sent Events.
// NOT wrapped in asyncHandler: it hijacks the response (SSE), so it manages its
// own errors rather than delegating to the JSON error handler.
export async function ask(req, res) {
  const question = String(req.body.question || '').trim()

  // Opens the SSE stream lazily (so pre-stream errors can still send JSON).
  const openStream = () => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // tell nginx not to buffer this response
    })
    res.flushHeaders?.()
  }

  try {
    // Fast-path: exact match to an active suggestion → stream the canned answer
    // instantly, no Gemini call needed (works even if the AI key isn't configured).
    const canned = await ChatbotSuggestion.findOne({ isActive: true, question }).select('answer').lean()
    if (canned) {
      openStream()
      sse(res, null, { delta: canned.answer })
      sse(res, 'done', { done: true })
      return res.end()
    }

    // Free-form question → needs Gemini. Fail with a plain JSON 503 BEFORE the
    // stream opens if the AI isn't configured.
    if (!gemini.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: { message: 'Chatbot tạm thời chưa sẵn sàng. Bạn quay lại sau nhé!' },
      })
    }

    const [kbEntries, suggestions] = await Promise.all([
      KnowledgeBase.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).select('title content').lean(),
      ChatbotSuggestion.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).select('question answer').lean(),
    ])

    openStream()
    let aborted = false
    req.on('close', () => {
      aborted = true
    })

    const systemInstruction = gemini.buildSystemInstruction({ kbEntries, suggestions })

    for await (const delta of gemini.streamAnswer({ question, systemInstruction })) {
      if (aborted) break
      sse(res, null, { delta })
    }

    if (!aborted) {
      sse(res, 'done', { done: true })
    }
    return res.end()
  } catch (err) {
    console.error('[chat] ask error:', err?.message || err)
    // If the stream is already open, surface a friendly SSE error; otherwise JSON 500.
    if (res.headersSent) {
      sse(res, 'error', { message: ERROR_LINE })
      return res.end()
    }
    return res.status(500).json({ success: false, error: { message: ERROR_LINE } })
  }
}

// ── Admin CRUD: Suggestions ─────────────────────────────────────────────────

export const adminListSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await ChatbotSuggestion.find().sort({ order: 1, createdAt: 1 }).lean()
  return ok(res, { suggestions })
})

export const createSuggestion = asyncHandler(async (req, res) => {
  const { question, answer, isActive, order } = req.body
  const doc = await ChatbotSuggestion.create({ question, answer, isActive, order })
  return created(res, { suggestion: doc })
})

export const updateSuggestion = asyncHandler(async (req, res) => {
  const { question, answer, isActive, order } = req.body
  const doc = await ChatbotSuggestion.findByIdAndUpdate(
    req.params.id,
    { question, answer, isActive, order },
    { new: true, runValidators: true }
  )
  if (!doc) throw ApiError.notFound('Không tìm thấy câu hỏi gợi ý')
  return ok(res, { suggestion: doc })
})

export const deleteSuggestion = asyncHandler(async (req, res) => {
  const doc = await ChatbotSuggestion.findByIdAndDelete(req.params.id)
  if (!doc) throw ApiError.notFound('Không tìm thấy câu hỏi gợi ý')
  return noContent(res)
})

// ── Admin CRUD: Knowledge Base ──────────────────────────────────────────────

export const adminListKb = asyncHandler(async (req, res) => {
  const entries = await KnowledgeBase.find().sort({ order: 1, createdAt: 1 }).lean()
  return ok(res, { entries })
})

export const createKb = asyncHandler(async (req, res) => {
  const { title, content, tags, isActive, order } = req.body
  const doc = await KnowledgeBase.create({ title, content, tags, isActive, order })
  return created(res, { entry: doc })
})

export const updateKb = asyncHandler(async (req, res) => {
  const { title, content, tags, isActive, order } = req.body
  const doc = await KnowledgeBase.findByIdAndUpdate(
    req.params.id,
    { title, content, tags, isActive, order },
    { new: true, runValidators: true }
  )
  if (!doc) throw ApiError.notFound('Không tìm thấy mục tri thức')
  return ok(res, { entry: doc })
})

export const deleteKb = asyncHandler(async (req, res) => {
  const doc = await KnowledgeBase.findByIdAndDelete(req.params.id)
  if (!doc) throw ApiError.notFound('Không tìm thấy mục tri thức')
  return noContent(res)
})
