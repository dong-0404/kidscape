import dotenv from 'dotenv'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

const num = (val, fallback) => {
  const n = parseInt(val ?? '', 10)
  return Number.isFinite(n) ? n : fallback
}

const port = num(process.env.PORT, 5000)

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProd,
  port,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kidscape',

  jwtSecret: process.env.JWT_SECRET || 'dev_insecure_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptSaltRounds: num(process.env.BCRYPT_SALT_ROUNDS, 12),

  // Trusted proxy hops in front of the API (Coolify Traefik + frontend nginx = 2 in prod).
  // Used by app.set('trust proxy', …) so req.ip / rate limiting key on the real client IP.
  trustProxy: num(process.env.TRUST_PROXY, 1),

  corsOrigins: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  rateLimit: {
    loginMax: num(process.env.RATE_LIMIT_LOGIN_MAX, 5),
    windowMin: num(process.env.RATE_LIMIT_WINDOW_MIN, 15),
  },

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || 'Admin KidScape',
    email: (process.env.SEED_ADMIN_EMAIL || 'admin@kidscape.vn').toLowerCase().trim(),
    password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
  },
}

// Fail-fast: never run production with insecure default secrets.
const INSECURE_SECRETS = ['', 'dev_insecure_secret_change_me', 'change_me_to_a_long_random_string']
if (isProd) {
  if (INSECURE_SECRETS.includes(config.jwtSecret) || config.jwtSecret.length < 24) {
    throw new Error('JWT_SECRET phải là chuỗi mạnh, duy nhất (>= 24 ký tự) ở môi trường production.')
  }
  if (config.seedAdmin.password === 'ChangeMe123!') {
    console.warn('⚠ SEED_ADMIN_PASSWORD vẫn là giá trị mẫu — hãy đổi trước khi seed ở production.')
  }
}

export default config
