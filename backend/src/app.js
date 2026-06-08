import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import { config } from './config/env.js'
import routes from './routes/index.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  // Trust the configured number of proxy hops so req.ip / rate limiting use the real
  // client IP (Coolify Traefik + nginx = 2 in prod; 1 by default for local/dev).
  app.set('trust proxy', config.trustProxy)

  app.use(helmet())
  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: false, // Bearer-token auth — no cookies needed.
    })
  )
  app.use(compression())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))
  app.use(mongoSanitize())
  app.use(morgan(config.isProd ? 'combined' : 'dev'))

  // API (rate-limited).
  app.use('/api', apiLimiter, routes)

  // 404 + centralized error handler (must be last).
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp
