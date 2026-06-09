import { Router } from 'express'
import mongoose from 'mongoose'
import authRoutes from './auth.routes.js'
import chatRoutes from './chat.routes.js'
import adminChatRoutes from './adminChat.routes.js'

const router = Router()

const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting']

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      db: DB_STATES[mongoose.connection.readyState] || 'unknown',
      uptime: Math.round(process.uptime()),
    },
  })
})

router.use('/auth', authRoutes)
router.use('/chat', chatRoutes)
router.use('/admin/chat', adminChatRoutes)

export default router
