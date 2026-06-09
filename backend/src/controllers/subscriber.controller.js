import Subscriber from '../models/Subscriber.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'

// ── Public ──────────────────────────────────────────────────────────────────

// POST /api/subscribers — capture an email from the newsletter box.
// Idempotent: re-subscribing the same email succeeds without duplicating.
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim()

  const existing = await Subscriber.findOne({ email })
  if (existing) return ok(res, { message: 'Bạn đã đăng ký rồi — cảm ơn bạn!' })

  try {
    await Subscriber.create({ email, source: 'products' })
  } catch (err) {
    if (err.code === 11000) return ok(res, { message: 'Bạn đã đăng ký rồi — cảm ơn bạn!' })
    throw err
  }
  return created(res, { message: 'Đăng ký thành công! Cảm ơn bạn đã quan tâm KidScape.' })
})

// ── Admin ───────────────────────────────────────────────────────────────────

export const adminListSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()
  return ok(res, { subscribers })
})

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const doc = await Subscriber.findByIdAndDelete(req.params.id)
  if (!doc) throw ApiError.notFound('Không tìm thấy email')
  return noContent(res)
})

// Escape one CSV cell (wrap + double inner quotes).
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

// GET /api/admin/subscribers/export — download all emails as CSV.
export const exportSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()

  const rows = [['email', 'source', 'ngay_dang_ky']]
  for (const s of subscribers) {
    rows.push([s.email, s.source, new Date(s.createdAt).toISOString()])
  }
  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\r\n')

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="kidscape-subscribers.csv"')
  // BOM so Excel opens UTF-8 correctly.
  return res.send('﻿' + csv)
})
