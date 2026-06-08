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

export default { apiLimiter, loginLimiter }
