// End-to-end auth test. Requires a reachable MongoDB at process.env.MONGODB_URI.
// Used by CI (with a `mongo` service) and runnable locally via `npm test`.
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kidscape_test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_long_enough_for_tests_only_123'

const { connectDB, disconnectDB } = await import('../src/config/db.js')
const Admin = (await import('../src/models/Admin.js')).default
const { createApp } = await import('../src/app.js')

let ok = true
const check = (label, cond) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`)
  if (!cond) ok = false
}

await connectDB()
await Admin.deleteMany({}) // clean slate

const EMAIL = 'e2e@kidscape.vn'
const PASS = 'ChangeMe123!'
await Admin.create({ name: 'E2E Admin', email: EMAIL, passwordHash: await Admin.hashPassword(PASS) })

const server = createApp().listen(0)
await new Promise((resolve) => server.once('listening', resolve))
const base = `http://127.0.0.1:${server.address().port}/api`

const req = (path, { method = 'GET', body, token } = {}) =>
  fetch(base + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

try {
  check('login sai mật khẩu -> 401', (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: 'wrong' } })).status === 401)

  const lr = await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: PASS } })
  const lj = await lr.json()
  const token = lj?.data?.token
  check('login đúng -> 200 + token + admin', lr.status === 200 && !!token && lj?.data?.admin?.email === EMAIL)

  check('/me không token -> 401', (await req('/auth/me')).status === 401)

  const mj = await (await req('/auth/me', { token })).json()
  check('/me có token -> admin', mj?.data?.admin?.email === EMAIL)

  check('đổi mật khẩu sai hiện tại -> 400', (await req('/auth/password', { method: 'PATCH', token, body: { currentPassword: 'nope', newPassword: 'NewPass123!' } })).status === 400)
  check('đổi mật khẩu đúng -> 200', (await req('/auth/password', { method: 'PATCH', token, body: { currentPassword: PASS, newPassword: 'NewPass123!' } })).status === 200)
  check('login mật khẩu mới -> 200', (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: 'NewPass123!' } })).status === 200)
  check('login mật khẩu cũ -> 401', (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: PASS } })).status === 401)

  check('health -> 200', (await req('/health')).status === 200)
} catch (e) {
  console.error('ERROR:', e)
  ok = false
} finally {
  await Admin.deleteMany({})
  server.close()
  await disconnectDB()
  console.log(ok ? '\n✅ ALL PASSED' : '\n❌ FAILED')
  process.exit(ok ? 0 : 1)
}
