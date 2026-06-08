import { config } from '../src/config/env.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import Admin from '../src/models/Admin.js'

const EXAMPLE_PASSWORD = 'ChangeMe123!'

// Create-only: never overwrites an existing admin's (possibly rotated) password.
async function seedAdmin() {
  const { name, email, password } = config.seedAdmin

  // Never create a public admin with the repo-known example password in production.
  if (config.isProd && (!password || password === EXAMPLE_PASSWORD)) {
    console.error(
      '✗ Bỏ qua seed: SEED_ADMIN_PASSWORD chưa được đặt hoặc đang là giá trị mẫu. ' +
        'Hãy đặt mật khẩu mạnh rồi deploy lại.'
    )
    return
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log(`• Admin "${email}" đã tồn tại — bỏ qua (không ghi đè mật khẩu).`)
    return
  }

  const passwordHash = await Admin.hashPassword(password)
  await Admin.create({ name, email, passwordHash })
  console.log(`✓ Đã tạo admin: ${email}`)

  if (password === EXAMPLE_PASSWORD) {
    console.warn('⚠ Mật khẩu admin đang là giá trị mẫu — hãy đổi ngay sau khi đăng nhập!')
  }
}

async function run() {
  await connectDB()
  try {
    await seedAdmin()
    console.log('Seed hoàn tất.')
  } finally {
    await disconnectDB()
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed lỗi:', err)
    process.exit(1)
  })
