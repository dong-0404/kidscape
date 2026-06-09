import rateLimit from 'express-rate-limit'
import { config } from '../config/env.js'

const jsonMessage = (msg) => ({ success: false, error: { message: msg } })

// Broad limiter applied to all /api traffic.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage('Quá nhiều yêu cầu, vui lòng thử lại sau.'),
})

// Strict limiter for login (brute-force protection).
export const loginLimiter = rateLimit({
  windowMs: config.rateLimit.windowMin * 60 * 1000,
  max: config.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage('Quá nhiều lần đăng nhập sai, vui lòng thử lại sau.'),
})

// Limiter for the AI chat endpoint (per-IP cost / abuse protection).
export const chatLimiter = rateLimit({
  windowMs: config.chat.rateWindowMin * 60 * 1000,
  max: config.chat.rateMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage('Bạn đang hỏi hơi nhanh đó! Chờ một chút rồi hỏi tiếp nhé.'),
})

export default { apiLimiter, loginLimiter, chatLimiter }
