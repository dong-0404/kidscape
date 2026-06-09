// End-to-end test for products + subscribers. Needs a reachable MongoDB at
// process.env.MONGODB_URI (CI mongo service; locally via the memory-server wrapper).
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kidscape_prod_test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_long_enough_for_tests_only_123'

const { connectDB, disconnectDB } = await import('../src/config/db.js')
const Admin = (await import('../src/models/Admin.js')).default
const Product = (await import('../src/models/Product.js')).default
const Subscriber = (await import('../src/models/Subscriber.js')).default
const { createApp } = await import('../src/app.js')

let ok = true
const check = (label, cond) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`)
  if (!cond) ok = false
}

await connectDB()
await Promise.all([Admin.deleteMany({}), Product.deleteMany({}), Subscriber.deleteMany({})])

const EMAIL = 'prod-e2e@kidscape.vn'
const PASS = 'ChangeMe123!'
await Admin.create({ name: 'Prod E2E', email: EMAIL, passwordHash: await Admin.hashPassword(PASS) })

const server = createApp().listen(0)
await new Promise((r) => server.once('listening', r))
const base = `http://127.0.0.1:${server.address().port}/api`

const req = (path, { method = 'GET', body, token } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

try {
  const token = (await (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: PASS } })).json())
    .data.token

  // ── Products: admin gating ──
  check('admin products không token -> 401', (await req('/admin/products')).status === 401)

  // ── Create product ──
  const cr = await req('/admin/products', {
    method: 'POST',
    token,
    body: {
      slug: 'bo-sach-do',
      name: 'Bộ Sách Đỏ',
      tag: 'Sách',
      desc: 'Mô tả',
      status: 'available',
      develops: ['Ngôn ngữ'],
      highlights: [{ title: 'Chạm', icon: '✋' }],
    },
  })
  check('tạo product -> 201', cr.status === 201)
  const productId = (await cr.json()).data.product._id

  // ── Invalid slug -> 422 ──
  check(
    'slug có khoảng trắng -> 422',
    (await req('/admin/products', { method: 'POST', token, body: { slug: 'sai slug', name: 'X' } })).status === 422
  )

  // ── Duplicate slug -> 409 ──
  check(
    'slug trùng -> 409',
    (await req('/admin/products', { method: 'POST', token, body: { slug: 'bo-sach-do', name: 'Y' } })).status === 409
  )

  // ── Upcoming product (no detail expectations) ──
  await req('/admin/products', {
    method: 'POST',
    token,
    body: { slug: 'sap-ra-mat', name: 'Sắp Ra Mắt', status: 'upcoming', isActive: true },
  })

  // ── Public list returns both ──
  const pl = await (await req('/products')).json()
  check('public list -> 2 sản phẩm active', Array.isArray(pl.data.products) && pl.data.products.length === 2)

  // ── Public get by slug ──
  const gb = await req('/products/bo-sach-do')
  check('public get slug -> 200', gb.status === 200 && (await gb.json()).data.product.name === 'Bộ Sách Đỏ')
  check('public get slug sai -> 404', (await req('/products/khong-co')).status === 404)

  // ── Update + soft-hide ──
  const up = await req(`/admin/products/${productId}`, { method: 'PATCH', token, body: { isActive: false } })
  check('update product -> 200', up.status === 200)
  const pl2 = await (await req('/products')).json()
  check('ẩn rồi -> public còn 1', pl2.data.products.length === 1)

  // ── Subscribers ──
  check(
    'subscribe email hợp lệ -> 201',
    (await req('/subscribers', { method: 'POST', body: { email: 'fan@kidscape.vn' } })).status === 201
  )
  check(
    'subscribe lại email cũ -> 200 (idempotent)',
    (await req('/subscribers', { method: 'POST', body: { email: 'fan@kidscape.vn' } })).status === 200
  )
  check('subscribe email sai -> 422', (await req('/subscribers', { method: 'POST', body: { email: 'nope' } })).status === 422)
  check('admin subscribers không token -> 401', (await req('/admin/subscribers')).status === 401)

  const subs = await (await req('/admin/subscribers', { token })).json()
  check('admin list subscribers -> 1', subs.data.subscribers.length === 1)

  const csv = await req('/admin/subscribers/export', { token })
  const csvText = await csv.text()
  check(
    'export CSV -> text/csv + chứa email',
    csv.headers.get('content-type').includes('text/csv') && csvText.includes('fan@kidscape.vn')
  )

  // ── Delete product ──
  check('xóa product -> 204', (await req(`/admin/products/${productId}`, { method: 'DELETE', token })).status === 204)
  check('xóa id sai -> 422', (await req('/admin/products/not-an-id', { method: 'DELETE', token })).status === 422)
} catch (e) {
  console.error('ERROR:', e)
  ok = false
} finally {
  await Promise.all([Admin.deleteMany({}), Product.deleteMany({}), Subscriber.deleteMany({})])
  server.close()
  await disconnectDB()
  console.log(ok ? '\n✅ ALL PASSED' : '\n❌ FAILED')
  process.exit(ok ? 0 : 1)
}
