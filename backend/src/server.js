import { createApp } from './app.js'
import { config } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import './models/index.js' // register all models

async function start() {
  await connectDB()

  const app = createApp()
  const server = app.listen(config.port, () => {
    console.log(`🚀 KidScape API: http://localhost:${config.port}  (${config.env})`)
  })

  const shutdown = (signal) => {
    console.log(`\n${signal} nhận được — đang tắt server…`)
    server.close(async () => {
      await disconnectDB()
      console.log('Đã đóng kết nối. Tạm biệt 👋')
      process.exit(0)
    })
    // Force-exit if graceful shutdown stalls.
    setTimeout(() => process.exit(1), 10_000).unref()
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch((err) => {
  console.error('Không thể khởi động server:', err)
  process.exit(1)
})
